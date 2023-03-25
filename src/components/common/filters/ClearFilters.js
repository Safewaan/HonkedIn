import { Box, Link } from '@chakra-ui/react'

const ClearFilters = ({ onClick}) => {
    return (
        <Box 
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
        marginTop="8px">
            <Link
                onClick={onClick}
                className="link"
                _hover={{ textDecor: "none" }}
            >
                Clear Filters
            </Link>
        </Box>

    )
};


export default ClearFilters; 