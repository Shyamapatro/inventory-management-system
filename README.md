# My inventory management App

## Overview

My inventory management App is a Node.js application that manages transactions and associated inventory items. It provides an API to retrieve transaction details, including item information such as names and descriptions.

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js** (v14.x or later)
- **MongoDB** (v4.x or later)

## Setup Instructions

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/Shyamapatro/inventory-management-system.git

cd use folder name
npm install

Create a .env file in the root directory of the project and add the following environment variables:

MONGODB_URI=mongodb://localhost:27017/your-database-name
PORT=3000

Run the Application

Start the server using the following command:

npm run dev


live server https://inventory-management-system-qdoq.onrender.com/api/inventory/getListOfItems