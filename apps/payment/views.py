from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.cart.models import Cart, CartItem
from apps.orders.models import Order, OrderItem
from apps.products.models import Product
from django.core.mail import send_mail
import braintree

gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=settings.BT_ENVIRONMENT,
        merchant_id=settings.BT_MERCHANT_ID,
        public_key=settings.BT_PUBLIC_KEY,
        private_key=settings.BT_PRIVATE_KEY
    )
)

class GenerateTokenView(APIView):
    def get(self, request, format=None):
        try:
            token = gateway.client_token.generate()

            return Response(
                {'braintree_token': token},
                status=status.HTTP_200_OK
            )
        except:
            return Response(
                {'error': 'Something went wrong when retrieving braintree token'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetPaymentTotalView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        tax = 0.21

        try:
            cart = Cart.objects.get(user=user)

            if not CartItem.objects.filter(cart=cart).exists():
                return Response(
                    {'error': 'Need to have items in cart'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            cart_items = CartItem.objects.filter(cart=cart)

            total_amount = 0.0
            total_compare_amount = 0.0

            for cart_item in cart_items:
                if not Product.objects.filter(id=cart_item.product.id).exists():
                    return Response(
                        {'error': 'A product with the provided ID does not exist'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if int(cart_item.count) > int(cart_item.product.quantity):
                    return Response(
                        {'error': 'Not enough items in stock'},
                        status=status.HTTP_200_OK
                    )
                
                total_amount += (float(cart_item.product.price) * float(cart_item.count))
                total_compare_amount += (float(cart_item.product.compare_price) * float(cart_item.count))

            total_compare_amount = round(total_compare_amount, 2)
            original_price = round(total_amount, 2)

            estimated_tax = round(total_amount * tax, 2)
            total_amount += (total_amount * tax)
            total_amount = round(total_amount, 2)

            return Response({
                'original_price': f'{original_price:.2f}',
                'total_amount': f'{total_amount:.2f}',
                'total_compare_amount': f'{total_compare_amount:.2f}',
                'estimated_tax': f'{estimated_tax:.2f}',
            },
                status=status.HTTP_200_OK
            )

        except:
            return Response(
                {'error': 'Something went wrong when retrieving payment total information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProcessPaymentView(APIView):
       def post(self, request, format=None):
        user = self.request.user
        data = self.request.data

        tax = 0.18

        nonce = data['nonce']

        full_name = data['full_name']
        address_line_1 = data['address_line_1']
        address_line_2 = data['address_line_2']
        city = data['city']
        state_province_region = data['state_province_region']
        postal_zip_code = data['postal_zip_code']
        country_region = data['country_region']
        telephone_number = data['telephone_number']

        cart = Cart.objects.get(user=user)

        if not CartItem.objects.filter(cart=cart).exists():
            return Response(
                {'error': 'Need to have items in cart'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_items = CartItem.objects.filter(cart=cart)

        total_amount = 0.0

        for cart_item in cart_items:
            total_amount += (float(cart_item.product.price) * float(cart_item.count))
        
        try:
            newTransaction = gateway.transaction.sale(
                {
                    'amount': str(total_amount),
                    'payment_method_nonce': str(nonce['nonce']),
                    'options': {
                        'submit_for_settlement': True
                    }
                }
            )
        except Exception as e:
            # Registrar el error
            print("Error en la transacción:", e)
            return Response(
                {'error': 'Error processing the transaction'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        if newTransaction.is_success or newTransaction.transaction:
            for cart_item in cart_items:
                update_product = Product.objects.get(id=cart_item.product.id)
                quantity = int(update_product.quantity) - int(cart_item.count)
                sold = int(update_product.sold) + int(cart_item.count)
                Product.objects.filter(id=cart_item.product.id).update(
                    quantity=quantity, sold=sold
                )
            
            try:
                order = Order.objects.create(
                    user=user,
                    transaction_id=newTransaction.transaction.id,
                    amount=total_amount,
                    full_name=full_name,
                    address_line_1=address_line_1,
                    address_line_2=address_line_2,
                    city=city,
                    state_province_region=state_province_region,
                    postal_zip_code=postal_zip_code,
                    country_region=country_region,
                    telephone_number=telephone_number,
                )
                 # Imprime el ID de la orden si se crea correctamente
                print('Orden creada con éxito. ID de la orden:', order.id)
            except Exception as e:
                # Registrar el error
                print("Error al crear la orden:", e)
                return Response(
                    {'error': 'Transaction succeeded but failed to create the order'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            for cart_item in cart_items:
                try:
                    product = Product.objects.get(id=cart_item.product.id)
                    OrderItem.objects.create(
                        product=product,
                        order=order,
                        name=product.name,
                        price=cart_item.product.price,
                        count=cart_item.count
                    )
                    
                except Exception as e:
                    # Registrar el error
                    print("Error al crear el item de orden:", e)
                    return Response(
                        {'error': 'Transaction succeeded and order created, but failed to create an order item'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            try:
                send_mail(
                    'Your Order Details',
                    'Hey ' + full_name + ','
                    + '\n\nWe received your order!'
                    + '\n\nGive us some time to process your order and ship it out to you.'
                    + '\n\nYou can go to your user dashboard to check the status of your order.'
                    + '\n\nSincerely,'
                    + '\nShop Time',
                    'maxitunn17@gmail.com',
                    [user.email],
                    fail_silently=False
                )
            except Exception as e:
                # Registrar el error
                print("Error al enviar el correo electrónico:", e)
                return Response(
                    {'error': 'Transaction succeeded and order created, but failed to send email'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                CartItem.objects.filter(cart=cart).delete()
                Cart.objects.filter(user=user).update(total_items=0)
            except Exception as e:
                # Registrar el error
                print("Error al limpiar el carrito:", e)
                return Response(
                    {'error': 'Transaction succeeded and order successful, but failed to clear cart'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response(
                {'success': 'Transaction successful and order was created'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Transaction failed'},
                status=status.HTTP_400_BAD_REQUEST
            )