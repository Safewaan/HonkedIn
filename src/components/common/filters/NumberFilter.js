import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Box,
    Text
} from '@chakra-ui/react'

const NumberFilter = ({ placeholder, value, onChange }) => {
    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text>{placeholder}</Text>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>

                <NumberInput
                    label
                    max={1000}
                    min={1}
                    className="form-input"
                    value={value}
                    onChange={onChange}
                    width="100%"
                    height="100%"
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Box>
        </div>

    )
};


export default NumberFilter; 