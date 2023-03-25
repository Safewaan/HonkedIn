import { Input, Box, Text } from '@chakra-ui/react'

const InputFilter = ({ placeholder, value, onChange }) => {
    return (
        <div>
            <Box
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
                marginTop="8px">
                <Text className="header">{placeholder}</Text>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Input
                    id="filter"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    variant="outline"
                    className="Header"
                />
            </Box>
        </div>
    )
};

export default InputFilter; 