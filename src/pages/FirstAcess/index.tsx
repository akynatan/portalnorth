import React, { useRef, useCallback } from 'react';
import { FiUser } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.png';

import Button from '../../components/Button';
import InputCPF from '../../components/InputCPF';

import { Container, Content, AnimationContainer } from './styles';
import api from '../../services/api';

interface FirstAcessFormData {
  document: string;
  password: string;
}

const FirstAcess: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { firstAccess } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: FirstAcessFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          document: Yup.string().required('Documento obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { document } = data;

        const response = await api.post('/clients/firstaccess', {
          document: document.replace(/[^\w\s]/gi, ''),
        });

        const { token } = response.data;

        history.push(`/criar-senha?token=${token}`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na consulta',
          description:
            'Ocorreu um erro ao buscar os dados da empresa, cheque o cnpj digitado.',
        });
      }
    },
    [addToast, history, firstAccess],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Portal North" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Primeiro Acesso</h1>
            <InputCPF name="document" icon={FiUser} placeholder="Documento" />
            <Button type="submit">Próximo</Button>
            <Link to="sign-in">Voltar</Link>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default FirstAcess;
