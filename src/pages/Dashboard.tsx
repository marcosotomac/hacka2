import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { FaPlus, FaWallet, FaSignOutAlt, FaEye, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { expenseService, categoryService } from '../services/api';
import type { Expense, ExpenseCategory, ExpenseSummary } from '../types';
import AddExpenseForm from '../components/AddExpenseForm';

const MotionBox = motion(Box);

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();

  useEffect(() => {
    loadCategories();
    loadExpenses();
  }, [currentMonth, currentYear]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      setError('Error al cargar categorías');
    }
  };

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await expenseService.getSummary(currentYear, currentMonth);
      setExpenses(data);
      setError('');
    } catch (error) {
      setError('Error al cargar gastos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const details = await expenseService.getDetails(
        currentYear,
        currentMonth,
        categoryId
      );
      setCategoryDetails(details);
      setSelectedCategory(categoryId);
      setError('');
    } catch (error) {
      setError('Error al cargar detalles de la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    setIsLoading(true);
    try {
      await expenseService.create(expense);
      setShowAddExpense(false);
      loadExpenses();
      setError('');
    } catch (error) {
      setError('Error al agregar gasto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return;
    
    setIsLoading(true);
    try {
      await expenseService.delete(expenseId);
      loadExpenses();
      if (selectedCategory) {
        handleCategoryClick(selectedCategory);
      }
      setError('');
    } catch (error) {
      setError('Error al eliminar gasto');
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.total, 0);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
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
                Ahorrista Dashboard
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

      <Container maxW="7xl" py={8}>
        {/* Controls */}
        <Box mb={8}>
          <HStack justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg" color="gray.700" mb={2}>
                Gestión de Gastos
              </Heading>
              <Text color="gray.600">
                {monthNames[currentMonth - 1]} {currentYear}
              </Text>
            </Box>
            <Button
              onClick={() => setShowAddExpense(true)}
              colorScheme="blue"
              size="lg"
              bgGradient="linear(to-r, blue.500, purple.500)"
              _hover={{ 
                bgGradient: "linear(to-r, blue.600, purple.600)",
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
              borderRadius="lg"
            >
              <HStack gap={2}>
                <FaPlus />
                <Text>Agregar Gasto</Text>
              </HStack>
            </Button>
          </HStack>

          <HStack gap={4} align="center">
            <HStack>
              <Text color="gray.600" fontWeight="medium">Mes:</Text>
              <select
                value={currentMonth}
                onChange={(e: any) => setCurrentMonth(Number(e.target.value))}
                style={{
                  background: 'white',
                  border: '1px solid #d2d6dc',
                  borderRadius: '6px',
                  padding: '4px 12px',
                }}
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </HStack>
            <HStack>
              <Text color="gray.600" fontWeight="medium">Año:</Text>
              <select
                value={currentYear}
                onChange={(e: any) => setCurrentYear(Number(e.target.value))}
                style={{
                  background: 'white',
                  border: '1px solid #d2d6dc',
                  borderRadius: '6px',
                  padding: '4px 12px',
                }}
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </HStack>
          </HStack>
        </Box>

        {/* Error Message */}
        {error && (
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="lg"
            p={4}
            mb={6}
            color="red.700"
          >
            <Text fontWeight="medium">{error}</Text>
          </Box>
        )}

        {/* Summary Card */}
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="lg"
          p={6}
          mb={8}
          border="2px"
          borderColor="blue.100"
        >
          <HStack justify="space-between" align="center">
            <Box>
              <Text color="gray.600" fontSize="sm" fontWeight="medium">
                Total de Gastos - {monthNames[currentMonth - 1]} {currentYear}
              </Text>
              <Heading size="2xl" color="blue.600">
                S/ {totalAmount.toFixed(2)}
              </Heading>
            </Box>
            <Box color="blue.500" fontSize="4xl">
              <FaWallet />
            </Box>
          </HStack>
        </Box>

        {/* Expense Categories Grid */}
        {isLoading ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.600">Cargando...</Text>
          </Box>
        ) : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {expenses.map((expense, index) => (
              <MotionBox
                key={`${expense.categoryId}-${currentYear}-${currentMonth}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Box
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  p={6}
                  cursor="pointer"
                  onClick={() => handleCategoryClick(expense.categoryId)}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.3s ease"
                  border="2px"
                  borderColor="transparent"
                  _active={{ transform: 'translateY(-2px)' }}
                >
                  <Stack gap={3}>
                    <HStack justify="space-between">
                      <Heading size="md" color="gray.700">
                        {expense.categoryName}
                      </Heading>
                      <Box color="blue.500">
                        <FaEye />
                      </Box>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      S/ {expense.total.toFixed(2)}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Click para ver detalles
                    </Text>
                  </Stack>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionBox
              bg="white"
              borderRadius="2xl"
              boxShadow="2xl"
              p={6}
              w="full"
              maxW="md"
              mx={4}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HStack justify="space-between" mb={6}>
                <Heading size="lg" color="gray.700">
                  Agregar Nuevo Gasto
                </Heading>
                <Button
                  onClick={() => setShowAddExpense(false)}
                  variant="ghost"
                  size="sm"
                >
                  <FaTimes />
                </Button>
              </HStack>
              <AddExpenseForm
                categories={categories}
                onSubmit={handleAddExpense}
                onCancel={() => setShowAddExpense(false)}
                year={currentYear}
                month={currentMonth}
              />
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Category Details Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MotionBox
              bg="white"
              borderRadius="2xl"
              boxShadow="2xl"
              p={6}
              w="full"
              maxW="2xl"
              mx={4}
              maxH="80vh"
              overflowY="auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HStack justify="space-between" mb={6}>
                <Heading size="lg" color="gray.700">
                  Detalles de Gastos
                </Heading>
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant="ghost"
                  size="sm"
                >
                  <FaTimes />
                </Button>
              </HStack>
              
              <Stack gap={4}>
                {categoryDetails.map((detail) => (
                  <Box
                    key={detail.id}
                    bg="gray.50"
                    borderRadius="lg"
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                  >
                    <HStack justify="space-between" align="center">
                      <Box flex={1}>
                        <Text fontWeight="bold" color="gray.700">
                          {detail.description}
                        </Text>
                        <Text color="gray.500" fontSize="sm">
                          {new Date(detail.date).toLocaleDateString()}
                        </Text>
                      </Box>
                      <HStack gap={3}>
                        <Text fontWeight="bold" color="green.600">
                          S/ {detail.amount.toFixed(2)}
                        </Text>
                        <Button
                          onClick={() => handleDeleteExpense(detail.id)}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                        >
                          <FaTrash />
                        </Button>
                      </HStack>
                    </HStack>
                  </Box>
                ))}
                {categoryDetails.length === 0 && (
                  <Text textAlign="center" color="gray.500" py={4}>
                    No hay gastos en esta categoría para este mes.
                  </Text>
                )}
              </Stack>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Dashboard;
