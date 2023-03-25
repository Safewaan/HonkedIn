import {
    Box,
    Input,
    Button,
    Flex,
    Link
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
            <Link
                onClick={onResetSearch}
                className="link"
                _hover={{ textDecor: "none" }}
            >
                Clear Search
            </Link>
        </Box>
    );
};

export default Search;