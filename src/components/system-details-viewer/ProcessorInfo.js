function ProcessorInfo({ data }) {
    if (!data || data.length === 0) {
        return <div>Data is not found.</div>;
    }

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
                                <td className="property-value">{item.model}</td>
                            </tr>
                            <tr>
                                <td className="property-name">Speed</td>
                                <td className="property-value">{item.speed}</td>
                            </tr>
                            {/* rendering times data */}
                            <tr>
                                <td className="property-name">Times</td>
                                <td className="property-value">
                                    <table>
                                        <tbody>
                                            {Object.entries(item.times).map(([timeKey, timeValue], timeIndex) => (
                                                <tr key={timeIndex}>
                                                    <td className="times-property-name">{timeKey}: </td>
                                                    <td className="times-property-value">{timeValue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

export default ProcessorInfo;