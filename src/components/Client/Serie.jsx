import { Card, CardBody } from '@chakra-ui/card'
import { Image, Stack, Text, Box, Tag, Tooltip, HStack } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'

const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
    <Box p='1'>
      <Tag ref={ref} {...rest}>
        {children}
      </Tag>
    </Box>
  ))
export const Serie = ({series}) => {
    const navigation = useNavigate()
    const handleViewAnime = ()=>{
        navigation(`/watch/${series.series_code}`)
    }
  return (
    <Card maxW='sm' style={{marginLeft:'3%', background:'#1A1A1B'}} borderRadius='lg' onClick={handleViewAnime}>
        <CardBody style={{color:'white'}}>
            <Image src={series.link_to_the_poster}
            alt={series.name_of_series} style={{borderRadius:'10px 10px 0 0'}}/>
            <Stack mt='6' spacing='3'>
            <HStack spacing={6} style={{marginLeft:'0.5rem', marginTop:'-5px'}}>
                <Tooltip label={series.series_description}>
                <CustomCard size='md'>{series.name_of_series}</CustomCard>
                </Tooltip>
            </HStack>
                <Text style={{marginLeft:'1rem', fontSize:'15px', color:'#878587'}}>Сезон: {series.season}</Text>
                <Text style={{marginLeft:'1rem', paddingBottom:'1rem', fontSize:'15px', color:'#878587'}}>Серия: {series.number_of_series}</Text>
            </Stack>
        </CardBody>
    </Card>
  )
}
