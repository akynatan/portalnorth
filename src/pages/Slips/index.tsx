/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
import React, { useCallback, useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

import MenuHeader from '../../components/MenuHeader';
import GoBack from '../../components/GoBack';

import api from '../../services/api';
import { Slip } from '../../types/Slip';
import { useToast } from '../../hooks/toast';
import { formatCurrency } from '../../helpers';

import { Container, Header, Content } from './styles';

const Slips: React.FC = () => {
  const { addToast } = useToast();
  const { id } = useParams<{ id: string }>();

  const [isFetching, setIsFetching] = useState(true);
  const [slips, setSlips] = useState<Slip[]>([]);

  useEffect(() => {
    api
      .get(`/slips?invoice_id=${id}`)
      .then(res => {
        setSlips(res.data);
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
  }, [id, addToast]);

  const downloadSlip = useCallback(
    ({ numSlip, codBank, slipId }) => {
      api
        .post(
          `/slips/${slipId}/download`,
          { numSlip, codBank },
          {
            responseType: 'blob',
          },
        )
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${slipId}.pdf`);
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
            title: 'Erro ao buscar notas fiscais',
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
        <Header>
          <GoBack />
          <Header>{`Boletos da Nota Fiscal ${id}`}</Header>
        </Header>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Data Emissão</th>
              <th>Data Vencimento</th>
              <th>Código de Barra</th>
              <th>Valor</th>
              <th>Baixar</th>
            </tr>
          </thead>
          <tbody>
            {slips.map(slip => {
              return (
                <tr key={slip.NUFIN}>
                  <td className="column1">{slip.DTNEG}</td>
                  <td className="column1">{slip.DTVENC}</td>
                  <td className="column1">{slip.CODIGOBARRA}</td>
                  <td className="column1">{formatCurrency(slip.VLRDESDOB)}</td>
                  <td className="column1">
                    <FiDownload
                      onClick={() => {
                        downloadSlip({
                          numSlip: slip?.NOSSONUM,
                          slipId: slip?.NUFIN,
                          codBank: slip?.CODBCO,
                        });
                      }}
                    />
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

export default Slips;
