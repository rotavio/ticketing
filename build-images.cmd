cd auth
rem npm update --save @rotavio-ticketing/common
docker build -t rotavio/auth .
docker push rotavio/auth

cd..
cd client
docker build -t rotavio/client .
docker push rotavio/client

cd..
cd expiration
rem npm update --save @rotavio-ticketing/common
docker build -t rotavio/expiration .
docker push rotavio/expiration

cd..
cd orders
rem npm update --save @rotavio-ticketing/common
docker build -t rotavio/orders .
docker push rotavio/orders

cd..
cd payments
rem npm update --save @rotavio-ticketing/common
docker build -t rotavio/payments .
docker push rotavio/payments

cd..
cd tickets
rem npm update --save @rotavio-ticketing/common
docker build -t rotavio/tickets .
docker push rotavio/tickets

cd..