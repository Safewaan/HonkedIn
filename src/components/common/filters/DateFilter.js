import {
    Text,
    Box
} from '@chakra-ui/react'

import { RangeDatepicker } from "chakra-dayzed-datepicker";

const DateFilter = ({ placeholder, selectedDates, onDateChange }) => {
    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text className="header">{placeholder}</Text>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', zIndex: 1 }}>
                <RangeDatepicker
                    className="header"
                    selectedDates={selectedDates}
                    onDateChange={onDateChange}
                    propsConfigs={{
                        dayOfMonthBtnProps: {
                            defaultBtnProps: {
                                _hover: {
                                    background: '#164684',
                                    color: '#F0F6FF',
                                },
                                _active: {
                                    background: '#214E89',
                                }
                            },
                            selectedBtnProps: {
                                background: '#023679',
                                color: '#F0F6FF',
                                _hover: {
                                    background: '#164684',
                                    color: '#F0F6FF',
                                },
                                _active: {
                                    background: '#214E89',
                                }
                            },
                            todayBtnProps: {
                                borderColor: "#023679"
                            },
                            isInRangeBtnProps: {
                                background: '#214E89',
                                color: '#F0F6FF',
                            }
                        }
                    }}
                />
            </Box>
        </div>

    )
};


export default DateFilter; 