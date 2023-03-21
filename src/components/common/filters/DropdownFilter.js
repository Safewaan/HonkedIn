import { Select, Box } from '@chakra-ui/react'

const Dropdown = ({ placeholder, value, onChange, lists }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Select
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            >
                {lists.map((list) => (
                    <option key={list} value={list}>
                        {list}
                    </option>
                ))}
            </Select>
        </Box>

    )
};


export default Dropdown; 