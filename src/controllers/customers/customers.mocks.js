import { v4 as uuidv4 } from 'uuid';

export const customerCreateMock = (data) => {
  return {
    status: "success",
    message: "Customer successfully added",
    data: {
      id: uuidv4(),
      firstName: data.firstName || " ",
      lastName: data.lastName || " ",
      phone: data.phone || " ",
      countryCode: data.countryCode || " ",
      email: data.email || " ",
      blacklist: data.blacklist || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }
}

export const customerGetMock = (customerId) => {
  return {
    status: "success",
    message: "Customer fetched successfully",
    data: {
      id: customerId,
      createdAt: "2025-05-29T12:40:44.212Z",
      updatedAt: "2025-05-29T12:40:44.212Z",
      firstName: "Bob",
      lastName: "Wonder",
      email: "bob6@bitnob.com",
      phone: "9012345678",
      countryCode: "+234",
      blacklist: false
    }
  }
}

export const getCustomersMock = () => {
  return {
    "status": true,
    "message": "successfully fetched all customers",
    "data": {
        "customers": [
            {
                "id": "b2075e03-51d8-42d8-8b64-4758648428c6",
                "createdAt": "2025-05-29T12:40:44.212Z",
                "updatedAt": "2025-05-29T12:40:44.212Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob6@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "2600da82-129a-4cfc-930d-a93b4028483a",
                "createdAt": "2025-05-29T12:39:24.063Z",
                "updatedAt": "2025-05-29T12:39:24.063Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob5@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "a570cd85-5dca-4cea-ba11-7731eeb52bef",
                "createdAt": "2025-05-29T12:38:52.622Z",
                "updatedAt": "2025-05-29T12:38:52.622Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob3@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "155ecf7e-9b4e-48c7-a4ff-1ed152deefb8",
                "createdAt": "2025-05-29T12:38:22.611Z",
                "updatedAt": "2025-05-29T12:38:22.611Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob2@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "953fdef6-960c-4cb1-bd6f-e8345cb719e3",
                "createdAt": "2025-05-29T12:27:42.120Z",
                "updatedAt": "2025-05-29T12:27:42.120Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob1@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "026503e8-0463-4e7e-a895-d7309d5d5564",
                "createdAt": "2025-05-28T17:02:13.195Z",
                "updatedAt": "2025-05-28T17:02:13.195Z",
                "firstName": "Bob",
                "lastName": "Wonder",
                "email": "bob@bitnob.com",
                "phone": "9012345678",
                "countryCode": "+234",
                "blacklist": false
            },
            {
                "id": "d17c5c10-2f02-46c3-bede-79200dab6f77",
                "createdAt": "2025-05-28T15:20:19.045Z",
                "updatedAt": "2025-05-28T15:20:19.045Z",
                "firstName": null,
                "lastName": null,
                "email": "maryjane@gmail.com",
                "phone": null,
                "countryCode": null,
                "blacklist": false
            },
            {
                "id": "17a99607-6834-431c-bd07-05f0a7298e0f",
                "createdAt": "2025-05-28T14:11:49.425Z",
                "updatedAt": "2025-05-28T14:11:49.425Z",
                "firstName": null,
                "lastName": null,
                "email": "internpulsecohort@gmail.com",
                "phone": null,
                "countryCode": null,
                "blacklist": false
            },
            {
                "id": "9aef2c0e-38a7-4e80-8bcf-948a07ea17ca",
                "createdAt": "2025-05-28T10:20:08.552Z",
                "updatedAt": "2025-05-28T10:20:08.552Z",
                "firstName": null,
                "lastName": null,
                "email": "test@bitnob.com",
                "phone": null,
                "countryCode": null,
                "blacklist": false
            },
            {
                "id": "973c0778-0aa0-435e-bac5-bd8a8121ea32",
                "createdAt": "2025-05-28T10:12:31.282Z",
                "updatedAt": "2025-05-28T10:12:31.282Z",
                "firstName": null,
                "lastName": null,
                "email": "johndoe@gmail.com",
                "phone": null,
                "countryCode": null,
                "blacklist": false
            }
        ],
        "meta": {
            "page": 1,
            "take": 10,
            "itemCount": 10,
            "pageCount": 1,
            "hasPreviousPage": false,
            "hasNextPage": false
        }
    }
}
  }