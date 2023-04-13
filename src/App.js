import React, { useEffect, useState } from 'react';

import './App.css';

function App() {

  const [SN, setSN] = useState(1);
  const [currency, setCurrency] = useState('INR');
  const [total, setTotal] = useState();
  const [Subtotal, setSubTotal] = useState(0);
  const [data, setData] = useState({});
  const [itemArray, setItemArray] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const date = new Date();

  // Calculate Subtotal and Total whenever itemArray, discount, or tax changes
  useEffect(() => {
    // Calculate Subtotal
    const calcSubtotal = itemArray.reduce((acc, item) => {
      return acc + (Number(item.rate) * item.qty);
    }, 0);
    setSubTotal(calcSubtotal);

    // Calculate Total
    const calcTotal = Subtotal - (Subtotal * Number(discount) / 100) + (Subtotal * Number(tax) / 100);
    setTotal(calcTotal);
  }, [itemArray, discount, tax]);

  // Format current date
  const currentDate = date.toLocaleString('en-UK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Increment SN and add item data to itemArray
  const SRN = () => {
    let count = SN + 1;
    setSN(count);
    setItemArray(itemArray => [...itemArray, data]);
  }

  // Handle changes in item input fields and update data state
  const handleItem = (event) => {
    const { name, value } = event.target;
    setData(data => ({
      ...data,
      [name]: value
    }))
  }

  // Handle changes in currency dropdown
  const handleCurrencyState = (event) => {
    setCurrency(event.target.value)
  }

  // Handle item delete from itemArray
  const handleDelete = (index) => {
    const updatedArray = [...itemArray];
    updatedArray.splice(index, 1);
    setItemArray(updatedArray);
    let count = SN - 1;
    setSN(count);
  }

  // Handle changes in discount and tax input fields
  const handleDiscount = (event) => {
    const { name, value } = event.target;
    if (name === 'discount') {
      setDiscount(value)
    } else {
      setTax(value)
    }
  }

  // Handle print button click
  const handlePrint = () => {
    window.print();
  }

  // Render itemArray as table rows
  const tableItem = () => {
    return itemArray.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            {item.item}<br />
            <p style={{ color: "lightgray" }}>{item.desc}</p>
          </td>
          <td>{item.qty}</td>
          <td>{item.rate}</td>
          <td className='hide'>
            <button type="button" onClick={() => handleDelete(index)} className="btn btn-danger">
              <i className="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      )
    })
  }

  return (

    <>
      <div className='head'><h1>InvoGene</h1>
        <p>Invoice Generator</p></div>
      <div className='container cont'>
        <div className='row'>
          <div className='col-lg-8 col-md-12 leftC'>
            <div className='row'>
              <div className='col-lg-6'>
                <p>Current Date:{currentDate}</p>
                <p className='due'>Due Date: <input type='date'></input></p>
              </div>
              <div className='col-lg-6'>
                <div className='inn'>Invoice Number:<input className='d-flex' type='number' defaultValue={1}></input></div>
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-lg-6">
                <div >
                  <p>Bill To:</p>
                  <input placeholder="Who is this invoice to?" /><br />
                  <input type='email' placeholder="Email" /><br />
                  <input type='textarea' placeholder="Billing Address" />
                </div>
              </div>
              <div class="col-lg-6">
                <div >
                  <p>Bill From:</p>
                  <input placeholder="Who is this invoice from?" /><br />
                  <input type='email' placeholder="Email" /><br />
                  <input type='textarea' placeholder="Billing Address" />
                </div>
              </div>
            </div>
            <hr />
            <div className='hide'>
              <form>
                <table className='table'>
                  <thead>
                    <tr>

                      <th>Item</th>
                      <th>QTY</th>
                      <th>Rate</th>

                    </tr>
                  </thead>

                  <tbody>

                    <tr>

                      <td ><input type='text' placeholder='item name' onChange={handleItem} name='item' required></input><input placeholder='item description' name='desc' onChange={handleItem}></input></td>
                      <td ><input type='number' onChange={handleItem} placeholder='QTY' name='qty' required></input></td>
                      <td ><input type='number' onChange={handleItem} placeholder='Rate' name='rate' required></input></td>

                    </tr>
                  </tbody>
                </table>
                <div className='d-flex justify-content-center'><button onClick={SRN} type="button" class="btn btn-success">
                  Add <i class="fas fa-plus"></i>
                </button></div>
              </form>
            </div>
            <div>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Item</th>
                    <th>QTY</th>
                    <th>Rate</th>
                    <th className='hide'>Action</th>
                  </tr>
                </thead>
                <tbody>

                  {tableItem()}

                </tbody>
              </table>
            </div>
            <div>
              <div className='row'>
                <div className='col-lg-6'></div>
                <div className='col-lg-6'>
                  <table className='table'>
                    <tr>
                      <td>Subtotal:</td>
                      <td style={{ textAlign: "right" }}>
                        {currency === 'INR' ? <span>&#x20B9;</span> : <span>&#x24;</span>}
                        {Subtotal}
                      </td>

                    </tr>
                    <tr>
                      <td >Discount:</td>
                      <td style={{ textAlign: "right" }}>{discount}%</td>
                    </tr>
                    <tr>
                      <td>Tax:</td>
                      <td style={{ textAlign: "right" }}>{tax}%</td>
                    </tr><hr />
                    <tr>
                      <td><h5>Total</h5></td>
                      <td style={{ textAlign: "right" }}>{currency === 'INR' ? <span>&#x20B9;</span> : <span>&#x24;</span>}
                        {total}</td>
                    </tr>
                  </table>
                </div>
              </div>

            </div>
            <div>
              <h5>
                Notes
              </h5>
              <input defaultValue={'Thanks for Your Business'}></input>
            </div>
            <button className='hide btn btn-success' onClick={handlePrint}>Review Invoice</button>
          </div>
          <div className='col-lg-4 col-md-12 hide rightC'>
            <div>
              <h5>Currency:</h5>
              <select value={currency} onChange={handleCurrencyState}>
                <option value={'INR'}>INR</option>
                <option value={'USD'}>USD</option>
              </select>
            </div>
            <div>
              <h5>Tax Rate:</h5>
              <input type='number' onChange={handleDiscount} name='tax' defaultValue={0}></input>
            </div>
            <div>
              <h5>Discount Rate:</h5>
              <input type='number' onChange={handleDiscount} name='discount' defaultValue={0}></input>
            </div>
            <div><button className='btn btn-success' onClick={handlePrint}>Review Invoice</button></div>
          </div>

        </div>

      </div>


    </>
  );
}

export default App;
