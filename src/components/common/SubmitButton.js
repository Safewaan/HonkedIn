import Button from '@material-ui/core/Button';

const SubmitButton = ({ label, onButtonClick }) => (
    <Button
        variant="contained"
        color="secondary"
        onClick={(event) => onButtonClick(event)}
        position='absolute'
    >
        {label}
    </Button>
)

export default SubmitButton; 