import TextField from '@material-ui/core/TextField';


const Search = ({ label, onSetSearch, searchTerm }) => {
    return (
        <TextField
            id="search"
            label={label}
            value={searchTerm}
            onChange={onSetSearch}
            variant="standard"
            autoComplete="off"
            color="secondary"
            fullWidth
        />
    )
};


export default Search; 