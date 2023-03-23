import {
    Box,
    Input,
    Button,
    Flex
} from "@chakra-ui/react";

import {
    SearchIcon
} from "@chakra-ui/icons";

import "../../styles/search-style.css";

const Search = ({ label, onSetSearch, searchTerm, onButtonClick, onResetSearch }) => {
    return (
        <Box>
            <Flex justify="space-between" align="center">
                <Input
                    id="search"
                    placeholder={label}
                    value={searchTerm}
                    onChange={onSetSearch}
                    variant="outline"
                    className="search-input"
                />
                <SearchIcon
                    variant="solid"
                    onClick={(event) => onButtonClick(event)}
                    position="relative"
                    boxSize="22px"
                    className="search-submit"
                />
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