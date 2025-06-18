import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Button,
  Stack,
  HStack,
} from '@chakra-ui/react';
import { FaEnvelope, FaLock, FaWallet, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, blue.400, purple.500, pink.400)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            boxShadow="2xl"
            p={8}
            border="1px"
            borderColor="rgba(255, 255, 255, 0.2)"
          >
            <Stack gap={6} align="stretch">
              {/* Header */}
              <Box textAlign="center">
                <HStack justify="center" mb={4}>
                  <Box color="blue.500" fontSize="3xl">
                    <FaWallet />
                  </Box>
                  <Heading size="xl" color="gray.700">
                    Ahorrista
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="lg">
                  Bienvenido de vuelta
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Inicia sesión para gestionar tus finanzas
                </Text>
              </Box>

              {/* Error Alert */}
              {error && (
                <Box
                  bg="red.50"
                  border="1px"
                  borderColor="red.200"
                  borderRadius="lg"
                  p={4}
                  color="red.700"
                >
                  <Text fontWeight="medium">{error}</Text>
                </Box>
              )}

              {/* Form */}
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <Box w="full">
                    <HStack mb={2}>
                      <Box color="gray.500">
                        <FaEnvelope />
                      </Box>
                      <Text color="gray.600" fontWeight="medium">
                        Correo Electrónico
                      </Text>
                    </HStack>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      h={12}
                      _hover={{ borderColor: 'blue.300' }}
                      _focus={{ borderColor: 'blue.500', bg: 'white' }}
                      required
                    />
                  </Box>

                  <Box w="full">
                    <HStack mb={2}>
                      <Box color="gray.500">
                        <FaLock />
                      </Box>
                      <Text color="gray.600" fontWeight="medium">
                        Contraseña
                      </Text>
                    </HStack>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      h={12}
                      _hover={{ borderColor: 'blue.300' }}
                      _focus={{ borderColor: 'blue.500', bg: 'white' }}
                      required
                    />
                  </Box>

                  <Button
                    type="submit"
                    w="full"
                    h={12}
                    size="lg"
                    colorScheme="blue"
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    _hover={{ 
                      bgGradient: "linear(to-r, blue.600, purple.600)",
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    _active={{ transform: 'translateY(0)' }}
                    transition="all 0.2s"
                    borderRadius="lg"
                    fontWeight="bold"
                    disabled={isLoading}
                  >
                    <HStack gap={2}>
                      <FaSignInAlt />
                      <Text>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</Text>
                    </HStack>
                  </Button>
                </Stack>
              </Box>

              {/* Footer */}
              <Box textAlign="center" pt={4}>
                <Text color="gray.600">
                  ¿No tienes una cuenta?{' '}
                  <Text as="span" color="blue.500" fontWeight="semibold">
                    <RouterLink to="/register">Regístrate aquí</RouterLink>
                  </Text>
                </Text>
              </Box>
            </Stack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Login; 