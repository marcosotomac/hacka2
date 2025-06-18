import React, { useState } from 'react';
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
import { FaEnvelope, FaLock, FaWallet, FaUserPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const MotionBox = motion(Box);

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (password.length < 12) {
      return 'La contraseña debe tener al menos 12 caracteres';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: 'gray' };
    if (password.length < 8) return { label: 'Muy débil', color: 'red' };
    if (password.length < 12) return { label: 'Débil', color: 'orange' };
    if (password.length >= 12) return { label: 'Fuerte', color: 'green' };
    return { label: '', color: 'gray' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await register(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al registrarse. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.400, blue.500, teal.400)"
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
                  <Box color="purple.500" fontSize="3xl">
                    <FaWallet />
                  </Box>
                  <Heading size="xl" color="gray.700">
                    Ahorrista
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="lg">
                  Crea tu cuenta
                </Text>
                <Text color="gray.500" fontSize="sm">
                  Únete y comienza a gestionar tus finanzas
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
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.500', bg: 'white' }}
                      required
                    />
                  </Box>

                  <Box w="full">
                    <HStack mb={2} justify="space-between">
                      <HStack>
                        <Box color="gray.500">
                          <FaLock />
                        </Box>
                        <Text color="gray.600" fontWeight="medium">
                          Contraseña
                        </Text>
                      </HStack>
                      {password.length > 0 && (
                        <Text fontSize="sm" color={`${passwordStrength.color}.500`} fontWeight="medium">
                          {passwordStrength.label}
                        </Text>
                      )}
                    </HStack>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 12 caracteres"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      h={12}
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.500', bg: 'white' }}
                      required
                    />
                  </Box>

                  <Box w="full">
                    <HStack mb={2} justify="space-between">
                      <HStack>
                        <Box color="gray.500">
                          <FaLock />
                        </Box>
                        <Text color="gray.600" fontWeight="medium">
                          Confirmar Contraseña
                        </Text>
                      </HStack>
                      {confirmPassword.length > 0 && (
                        <Box color={passwordsMatch ? 'green.500' : 'red.500'}>
                          {passwordsMatch ? <FaCheckCircle /> : <FaTimesCircle />}
                        </Box>
                      )}
                    </HStack>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      bg="gray.50"
                      border="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      h={12}
                      _hover={{ borderColor: 'purple.300' }}
                      _focus={{ borderColor: 'purple.500', bg: 'white' }}
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
                      <FaUserPlus />
                      <Text>{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
                    </HStack>
                  </Button>
                </Stack>
              </Box>

              {/* Footer */}
              <Box textAlign="center" pt={4}>
                <Text color="gray.600">
                  ¿Ya tienes una cuenta?{' '}
                  <Text as="span" color="blue.500" fontWeight="semibold">
                    <RouterLink to="/login">Inicia sesión aquí</RouterLink>
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

export default Register;
