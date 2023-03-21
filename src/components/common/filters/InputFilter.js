import { Input, Box } from '@chakra-ui/react'

const InputFilter = ({ placeholder, value, onChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Input
          id="filter"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          variant="outline"
          className="filter-input"
        />
        </Box>

    )
};


export default InputFilter; 