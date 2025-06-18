import React, { useState } from 'react';
import { Box, Button, Input, Text, Stack, HStack } from '@chakra-ui/react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import type { Expense, ExpenseCategory } from '../types';

interface AddExpenseFormProps {
  categories: ExpenseCategory[];
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  year: number;
  month: number;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  year,
  month,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Omit<Expense, 'id'> = {
      description,
      amount: Number(amount),
      categoryId: Number(categoryId),
      date: date || new Date(year, month - 1).toISOString().split('T')[0],
    };
    onSubmit(expense);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Box>
          <Text mb={2} color="gray.600" fontWeight="medium">
            Descripción
          </Text>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe tu gasto"
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

        <Box>
          <Text mb={2} color="gray.600" fontWeight="medium">
            Monto (S/)
          </Text>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            bg="gray.50"
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            h={12}
            _hover={{ borderColor: 'blue.300' }}
            _focus={{ borderColor: 'blue.500', bg: 'white' }}
            min="0"
            step="0.01"
            required
          />
        </Box>

        <Box>
          <Text mb={2} color="gray.600" fontWeight="medium">
            Categoría
          </Text>
          <select
            value={categoryId}
            onChange={(e: any) => setCategoryId(e.target.value)}
            required
            style={{
              background: '#f7fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '0.5rem',
              height: '3rem',
              padding: '0 12px',
              width: '100%',
              appearance: 'none',
            }}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Box>

        <Box>
          <Text mb={2} color="gray.600" fontWeight="medium">
            Fecha
          </Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            bg="gray.50"
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            h={12}
            _hover={{ borderColor: 'blue.300' }}
            _focus={{ borderColor: 'blue.500', bg: 'white' }}
            min={`${year}-${String(month).padStart(2, '0')}-01`}
            max={`${year}-${String(month).padStart(2, '0')}-31`}
          />
        </Box>

        <HStack justify="flex-end" gap={3} mt={6}>
          <Button
            onClick={onCancel}
            variant="ghost"
            colorScheme="gray"
            size="lg"
            borderRadius="lg"
          >
            <HStack gap={2}>
              <FaTimes />
              <Text>Cancelar</Text>
            </HStack>
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            borderRadius="lg"
            bgGradient="linear(to-r, blue.500, purple.500)"
            _hover={{ 
              bgGradient: "linear(to-r, blue.600, purple.600)",
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            _active={{ transform: 'translateY(0)' }}
            transition="all 0.2s"
          >
            <HStack gap={2}>
              <FaPlus />
              <Text>Agregar Gasto</Text>
            </HStack>
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default AddExpenseForm;
