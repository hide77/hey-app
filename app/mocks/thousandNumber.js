export default _number => {
	_number = parseInt(_number);
	if (!_number){
		_number = 0;
	}
	let processedNumber;

  if(_number == 0) {
    processedNumber = '0';
  }
	else if (_number < 1000) {
		processedNumber = `${_number}`;
	} else if (_number < 1000000) {
		processedNumber = `${Math.round(_number/100) / 10}K`;
	} else if (_number < 1000000000) {
		processedNumber = `${Math.round(_number/10000) / 100}M`;
	} else {
		processedNumber = `${Math.round(_number/10000000) / 100}B`;
	}

	return processedNumber;
}
