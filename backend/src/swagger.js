const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
    openapi: "3.0.0",
    info: {
        title: "Fire Safety Planning & Quotation API",
        version: "1.0.0",
        description: "API Documentation for Fire Safety Planning & Quotation System",
    },

    servers: [
        {
            url: "http://localhost:5000",
        },
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },

    security: [
        {
            bearerAuth: []
        }
    ]
},

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;