import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Button,
  Grid,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FaChartLine, FaWallet, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard Principal',
      description: 'Ve tu resumen de gastos y gestiona tus finanzas',
      icon: FaTachometerAlt,
      color: 'blue',
      action: () => navigate('/'),
    },
    {
      title: 'Análisis Detallado',
      description: 'Próximamente: Gráficos y análisis avanzados',
      icon: FaChartLine,
      color: 'green',
      action: () => alert('Funcionalidad próximamente disponible'),
    },
    {
      title: 'Gestión de Presupuesto',
      description: 'Próximamente: Configura y gestiona tu presupuesto',
      icon: FaWallet,
      color: 'purple',
      action: () => alert('Funcionalidad próximamente disponible'),
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" boxShadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl" py={4}>
          <HStack justify="space-between" align="center">
            <HStack gap={3}>
              <Box color="blue.500" fontSize="2xl">
                <FaWallet />
              </Box>
              <Heading size="lg" color="gray.700">
                Ahorrista Menu
              </Heading>
            </HStack>
            <HStack gap={4}>
              <Text color="gray.600">
                Hola, <Text as="span" fontWeight="bold">{user?.email}</Text>
              </Text>
              <Button
                onClick={logout}
                colorScheme="red"
                variant="ghost"
                size="sm"
              >
                <FaSignOutAlt />
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxW="7xl" py={12}>
        <Box textAlign="center" mb={12}>
          <Heading size="2xl" mb={4} color="gray.700">
            Bienvenido a Ahorrista
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto">
            Tu plataforma completa para gestión de finanzas personales. 
            Controla tus gastos, analiza tus patrones de consumo y alcanza tus metas financieras.
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {menuItems.map((item, index) => (
            <MotionBox
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="lg"
                p={8}
                cursor="pointer"
                onClick={item.action}
                _hover={{
                  transform: 'translateY(-8px)',
                  boxShadow: '2xl',
                }}
                transition="all 0.3s ease"
                border="2px"
                borderColor="transparent"
                _active={{
                  transform: 'translateY(-4px)',
                }}
                h="full"
              >
                <Box textAlign="center">
                  <Box
                    color={`${item.color}.500`}
                    fontSize="4xl"
                    mb={6}
                    transition="transform 0.3s ease"
                  >
                    <item.icon />
                  </Box>
                  
                  <Heading size="lg" mb={4} color="gray.700">
                    {item.title}
                  </Heading>
                  
                  <Text color="gray.600" lineHeight="relaxed">
                    {item.description}
                  </Text>
                  
                  <Box
                    mt={6}
                    px={6}
                    py={2}
                    bg={`${item.color}.50`}
                    color={`${item.color}.600`}
                    borderRadius="full"
                    display="inline-block"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    {index === 0 ? 'Disponible' : 'Próximamente'}
                  </Box>
                </Box>
              </Box>
            </MotionBox>
          ))}
        </Grid>

        <Box textAlign="center" mt={16}>
          <Box
            bg="blue.50"
            borderRadius="2xl"
            p={8}
            border="2px"
            borderColor="blue.100"
          >
            <Heading size="lg" mb={4} color="blue.700">
              ¿Nuevo en Ahorrista?
            </Heading>
            <Text color="blue.600" mb={6} maxW="xl" mx="auto">
              Comienza registrando tus gastos diarios para obtener insights valiosos 
              sobre tus hábitos financieros y mejorar tu control de gastos.
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/')}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Ir al Dashboard
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Menu;
