import buildCustomerXML from './../helpers/customer-xml.js';
import axios from 'axios';

export default async function pushCustomerToTally(customer) {
  const xml = buildCustomerXML(customer);
  console.log('--- Outgoing Tally XML ---\n', xml);

  try {
    const response = await axios.post('http://localhost:9000', xml, {
      headers: { 'Content-Type': 'text/xml' }
    });

    console.log('--- Tally Response ---');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('XML Response Data:\n', response.data); // <- Important!

  } catch (error) {
    console.error('--- Tally Request Failed ---');

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }

    console.error('Request Config:', error.config);
  }
}
