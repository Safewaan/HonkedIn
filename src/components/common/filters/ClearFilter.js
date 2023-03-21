import { Box, Button} from '@chakra-ui/react'
import "../../../styles/search-style.css";

const ClearFilter = ({ onClick}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Button
                variant="link"
                onClick={onClick}
                className="search-reset"
                _hover={{ textDecor: "none" }}
            >
                Clear Filter
            </Button>
        </Box>

    )
};


export default ClearFilter; 