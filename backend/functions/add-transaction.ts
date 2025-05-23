import { isValidTransaction, addTransaction } from '../utils/spreadsheet';
import { type Transaction } from '../types/transaction';
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Set headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Check for request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing request body' })
      };
    }

    // Parse and validate transaction
    const transaction = JSON.parse(event.body);
    
    if (!isValidTransaction(transaction)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid transaction data' })
      };
    }
    
    // Add ID if not provided
    if (!transaction.id) {
      transaction.id = Date.now().toString();
    }
    
    // Process the transaction
    // const result = await addTransaction(transaction);
    
    // For now, just echo back the transaction with success flag
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        data: transaction,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error processing transaction:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};