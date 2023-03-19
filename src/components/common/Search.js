import {
    Box,
    Input,
    Button,
    Flex
} from "@chakra-ui/react";

import "../../styles/search-style.css";

const Search = ({ label, onSetSearch, searchTerm, onButtonClick, onResetSearch }) => {
    return (
        <Box>
            <Flex justify="space-between">
                <Input
                    id="search"
                    placeholder={label}
                    value={searchTerm}
                    onChange={onSetSearch}
                    variant="outline"
                    className="search-input"
                />
                <Button
                    variant="solid"
                    onClick={(event) => onButtonClick(event)}
                    position="relative"
                    className="search-submit"
                >
                    Search
                </Button>

            </Flex>
            <Button
                variant="link"
                onClick={onResetSearch}
                className="search-reset"
                _hover={{ textDecor: "none" }}
            >
                Clear Search
            </Button>
        </Box>
    );
};

export default Search;