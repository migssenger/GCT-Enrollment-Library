import "../App.css";

function Tuition() {
  return (
    <div className="tuition-container">
      <div className="tuition-content">
        <h1 className="tuition-title">Tuition and Fees</h1>
        
        <div className="tuition-header">
          <h2>GARCIA COLLEGE OF TECHNOLOGY</h2>
          <h3>Kalibo, Aklan</h3>
          <h4>ASSESSMENT</h4>
          <p>2nd Semester, Academic Year 2025-2026</p>
        </div>

        {/* BSCE Section */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Civil Engineering (BSCE)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSCE - 1</th>
                  <th>BSCE - 2</th>
                  <th>BSCE - 3</th>
                  <th>BSCE - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>1,864.42</td>
                  <td>1,936.00</td>
                  <td>2,796.63</td>
                  <td>1,864.42</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 4,284.54</td>
                  <td>₱ 3,448.62</td>
                  <td>₱ 4,309.25</td>
                  <td>₱ 3,377.04</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>7,562.50</td>
                  <td>5,976.72</td>
                  <td>5,223.20</td>
                  <td>5,745.52</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 11,847.04</strong></td>
                  <td><strong>₱ 9,425.34</strong></td>
                  <td><strong>₱ 9,532.45</strong></td>
                  <td><strong>₱ 9,122.56</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSEE Section */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Electrical Engineering (BSEE)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSEE - 1</th>
                  <th>BSEE - 2</th>
                  <th>BSEE - 3</th>
                  <th>BSEE - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>1,900.21</td>
                  <td>1,864.42</td>
                  <td>2,796.63</td>
                  <td>4,661.05</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 4,320.33</td>
                  <td>₱ 3,377.04</td>
                  <td>₱ 4,309.25</td>
                  <td>₱ 6,173.67</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>6,755.07</td>
                  <td>5,336.76</td>
                  <td>6,006.68</td>
                  <td>5,745.52</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 11,075.40</strong></td>
                  <td><strong>₱ 8,713.80</strong></td>
                  <td><strong>₱ 10,315.93</strong></td>
                  <td><strong>₱ 11,919.19</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSME Section */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Mechanical Engineering (BSME)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSME - 1</th>
                  <th>BSME - 2</th>
                  <th>BSME - 3</th>
                  <th>BSME - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>1,900.21</td>
                  <td>2,832.42</td>
                  <td>1,864.42</td>
                  <td>5,593.26</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 4,320.33</td>
                  <td>₱ 4,345.04</td>
                  <td>₱ 3,377.04</td>
                  <td>₱ 7,105.88</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>7,662.57</td>
                  <td>5,254.17</td>
                  <td>5,484.36</td>
                  <td>6,790.16</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 11,982.90</strong></td>
                  <td><strong>₱ 9,599.21</strong></td>
                  <td><strong>₱ 8,861.40</strong></td>
                  <td><strong>₱ 13,896.04</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSA */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Accountancy (BSA)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSA - 1</th>
                  <th>BSA - 2</th>
                  <th>BSA - 3</th>
                  <th>BSA - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>-</td>
                  <td>968.00</td>
                  <td>968.00</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 2,420.12</td>
                  <td>₱ 2,480.62</td>
                  <td>₱ 2,480.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>7,865.00</td>
                  <td>6,059.31</td>
                  <td>5,908.59</td>
                  <td>5,484.36</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 10,258.12</strong></td>
                  <td><strong>₱ 8,539.93</strong></td>
                  <td><strong>₱ 8,389.21</strong></td>
                  <td><strong>₱ 6,996.98</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSHM */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Hospitality Management (BSHM)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSHM - 1</th>
                  <th>BSHM - 2</th>
                  <th>BSHM - 3</th>
                  <th>BSHM - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>3,146.00</td>
                  <td>3,146.00</td>
                  <td>3,146.00</td>
                  <td>3,146.00</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 5,566.12</td>
                  <td>₱ 4,658.62</td>
                  <td>₱ 4,658.62</td>
                  <td>₱ 4,658.62</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>6,957.50</td>
                  <td>8,766.00</td>
                  <td>8,170.26</td>
                  <td>2,334.36</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 12,523.62</strong></td>
                  <td><strong>₱ 13,425.30</strong></td>
                  <td><strong>₱ 12,828.88</strong></td>
                  <td><strong>₱ 6,992.98</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSCS */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Computer Science (BSCS)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSCS - 1</th>
                  <th>BSCS - 2</th>
                  <th>BSCS - 3</th>
                  <th>BSCS - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>1,936.00</td>
                  <td>1,936.00</td>
                  <td>2,904.00</td>
                  <td>968.00</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 4,356.12</td>
                  <td>₱ 3,448.62</td>
                  <td>₱ 4,416.62</td>
                  <td>₱ 2,480.62</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>7,858.13</td>
                  <td>9,747.53</td>
                  <td>8,413.44</td>
                  <td>3,542.07</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 12,214.25</strong></td>
                  <td><strong>₱ 13,196.15</strong></td>
                  <td><strong>₱ 12,830.06</strong></td>
                  <td><strong>₱ 4,855.51</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSIT */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Information Technology (BSIT)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSIT - 1</th>
                  <th>BSIT - 2</th>
                  <th>BSIT - 3</th>
                  <th>BSIT - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>1,936.00</td>
                  <td>2,904.00</td>
                  <td>2,904.00</td>
                  <td>968.00</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 4,356.12</td>
                  <td>₱ 3,448.62</td>
                  <td>₱ 4,416.62</td>
                  <td>₱ 2,480.62</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>6,650.42</td>
                  <td>9,747.53</td>
                  <td>8,413.44</td>
                  <td>3,542.07</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 11,006.54</strong></td>
                  <td><strong>₱ 14,164.15</strong></td>
                  <td><strong>₱ 12,830.06</strong></td>
                  <td><strong>₱ 6,022.69</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BSOA */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Office Administration (BSOA)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSOA - 1</th>
                  <th>BSOA - 2</th>
                  <th>BSOA - 3</th>
                  <th>BSOA - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>-</td>
                  <td>932.21</td>
                  <td>1,900.21</td>
                  <td>1,864.42</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 2,420.12</td>
                  <td>₱ 2,444.83</td>
                  <td>₱ 3,412.83</td>
                  <td>₱ 3,377.04</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>6,050.00</td>
                  <td>4,851.60</td>
                  <td>5,908.59</td>
                  <td>1,566.96</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 8,470.12</strong></td>
                  <td><strong>₱ 7,296.43</strong></td>
                  <td><strong>₱ 9,321.42</strong></td>
                  <td><strong>₱ 4,944.00</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

         {/* BSBA */}
        <div className="tuition-section">
          <h3 className="program-title">Bachelor of Science in Business Administration (BSBA)</h3>
          <div className="table-container">
            <table className="tuition-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>BSBA - 1</th>
                  <th>BSBA - 2</th>
                  <th>BSBA - 3</th>
                  <th>BSBA - 4</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gen. Fee</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                </tr>
                <tr>
                  <td>Lab. Fee</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>1,864.42</td>
                </tr>
                <tr>
                  <td>NSTP</td>
                  <td>907.50</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className="subtotal">
                  <td>Sub-Total</td>
                  <td>₱ 2,420.12</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 1,512.62</td>
                  <td>₱ 3,377.04</td>
                </tr>
                <tr>
                  <td>Tuition Fee</td>
                  <td>6,957.50</td>
                  <td>4,851.60</td>
                  <td>5,484.36</td>
                  <td>2,350.44</td>
                </tr>
                <tr className="total">
                  <td><strong>Total</strong></td>
                  <td><strong>₱ 9,377.62</strong></td>
                  <td><strong>₱ 6,364.22</strong></td>
                  <td><strong>₱ 6,996.98</strong></td>
                  <td><strong>₱ 5,727.48</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="tuition-footer">
          <p>For inquiries and clarifications, please contact the Accounting Office at (036) 268-1234 or email accounting@gct.edu.ph</p>
          <p className="disclaimer">
            <strong>Disclaimer:</strong> Tuition and fees are subject to change without prior notice. All amounts are in Philippine Peso (₱).
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tuition;