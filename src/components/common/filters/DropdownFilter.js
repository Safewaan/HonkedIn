import { Text, Select, Box } from '@chakra-ui/react'

const DropdownFilter = ({ placeholder, value, onChange, lists }) => {
    return (
        <div>
            <Box
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
                marginTop="8px">
                <Text className="header">{placeholder}</Text>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Select
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="header to-text"
                >
                    {lists.map((list) => (
                        <option key={list} value={list}>
                            {list}
                        </option>
                    ))}
                </Select>
            </Box>
        </div>
    )
};

export default DropdownFilter; 