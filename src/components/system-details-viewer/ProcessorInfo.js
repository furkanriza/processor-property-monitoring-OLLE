function ProcessorInfo({ data }) {
    if (!data || data.length === 0) return null;
  
    return (
      <div className="processor-info">
        {data.map((item, index) => (
          <div className='processor-component' key={index}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th className='table-title'>Processor Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="property-name">Model</td>
                  <td className="property-value">{decodeFromMorse(item.model)}</td>
                </tr>
                <tr>
                  <td className="property-name">Speed</td>
                  <td className="property-value">{decodeFromMorse(item.speed)}</td>
                </tr>
                {/* Map through `item.times` if necessary */}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
  