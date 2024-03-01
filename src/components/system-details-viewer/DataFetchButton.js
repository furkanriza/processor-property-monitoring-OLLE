function DataFetchButton({ onFetch }) {
    return (
      <div className='update-button-container'>
        <button className='update-button' onClick={onFetch}>Fetch Data</button>
      </div>
    );
  }
  