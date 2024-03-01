function OtherSystemInfo({ data }) {
    return (
      <div className='other-infos'>
        <table className="custom-table">
          <thead>
            <tr>
              <th className='table-title'>Other System Informations</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value], index) => (
              <tr key={index}>
                <td className="property-name">{value.property}</td>
                <td className="property-value">{value.decodedData}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  