/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { FiDownload, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import MenuHeader from '../../components/MenuHeader';

import api from '../../services/api';
import { Invoice } from '../../types/Invoice';
import { useToast } from '../../hooks/toast';
import { formatCurrency } from '../../helpers';

import { Container, Content, Header } from './styles';

const Invoices: React.FC = () => {
  const { addToast } = useToast();

  const [isFetching, setIsFetching] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    api
      .get('/invoices')
      .then(res => {
        setInvoices(res.data);
      })
      .catch(err => {
        const description = err?.response?.data?.error || '';
        addToast({
          type: 'error',
          title: 'Erro ao buscar notas fiscais',
          description,
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const downloadInvoice = useCallback(
    invoice_id => {
      api
        .post(
          `/invoices/${invoice_id}/download`,
          {},
          {
            responseType: 'blob',
          },
        )
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${invoice_id}.pdf`);
          document.body.appendChild(link);

          link.click();

          window.URL.revokeObjectURL(url);

          addToast({
            type: 'success',
            title: 'Documento baixado!',
          });
        })
        .catch(err => {
          const description = err?.response?.data?.error || '';
          addToast({
            type: 'error',
            title: 'Erro ao fazer download da nota fiscal',
            description,
          });
        });
    },
    [addToast],
  );

  return (
    <Container>
      <MenuHeader />

      <Content>
        <Header>Notas Fiscais</Header>
        <table>
          <thead>
            <tr className="table100-head">
              <th>Data</th>
              <th>Nº Nota</th>
              <th>Valor</th>
              <th>Baixar</th>
              <th>Visualizar Boletos</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => {
              return (
                <tr key={invoice.NUNOTA}>
                  <td className="column1">{invoice.DTNEG}</td>
                  <td className="column1">{invoice.NUMNOTA}</td>
                  <td className="column1">{formatCurrency(invoice.VLRNOTA)}</td>
                  <td className="column1">
                    <FiDownload
                      onClick={() => downloadInvoice(invoice?.NUNOTA)}
                    />
                  </td>
                  <td className="column1">
                    <Link to={`/notafiscal/${invoice.NUMNOTA}/boletos`}>
                      <FiList />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetching && <p className="fetching">Carregando...</p>}
      </Content>
    </Container>
  );
};

export default Invoices;
