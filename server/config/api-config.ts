let customersAPI: string;
let employeesAPI: string;
let userInterface: string;

const useLocalAPI = process.env.USE_LOCAL_API;

console.log(`useLocalAPI: ${useLocalAPI}`);

if (useLocalAPI === "true") {
    customersAPI = "http://localhost:9000/";
    employeesAPI = "http://localhost:9001/";
    userInterface = "http://localhost:3000/";
} else {
    employeesAPI = "https://employee-api-p3.herokuapp.com/";
    customersAPI = "https://customer-api-p3.herokuapp.com/";
    userInterface = "https://www.fit2work.life/";
}

export const CUSTOMERS_API = customersAPI;
export const EMPLOYEES_API = employeesAPI;
export const USER_INTERFACE = userInterface;
