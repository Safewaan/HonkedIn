import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";

const Search = ({ label, onSetSearch, searchTerm, onButtonClick }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <TextField
                id="search"
                label={label}
                value={searchTerm}
                onChange={onSetSearch}

                autoComplete="off"
                color="secondary"
                inline variant="standard"
                fullWidth

            />

            <Button
                inline variant="contained"
                maxHeight= '20px'
                color="secondary"
                onClick={(event) => onButtonClick(event)}
                position='absolute'
            >
                SEARCH
            </Button>
        </Box>

    )
};


export default Search; 