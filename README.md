# Auth Example

Description: Write simple authentication api by TOTP schema, 

1. Sign up 
 POST http://localhost:4000/api/signup
 example of body: { name: 'quoc', email: 'voongvinhquoc@gmail.com', password: '123' }

2. Login
 POST  http://localhost:4000/api/login
 example of body: { email: 'voongvinhquoc@gmail.com', password: '123' }
 
3. Logout
 POST http://localhost:4000/api/logout
 Header: 
   uuid: #{response from login}
   x-user: #{response from login}
   
4. Search user
  GET http://localhost:4000/api/user/search
  Header: 
    uuid: #{response from login}
    x-user: #{response from login}
  
  Query params
    - name
    - email
    - latest (timestamp)
    - fields (selected fields)
    - skip and limit (paging)

NOTE: any request to server has to update uuid of header because uuid will be change for each request.