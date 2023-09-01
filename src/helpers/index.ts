export const formatCurrency = (numeroString: string): string => {
  const numeroLimpo = numeroString.replace(/[^\d]/g, '');

  const numero = parseFloat(numeroLimpo);

  if (Number.isNaN(numero)) {
    return numeroString;
  }

  const valorFormatado = numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return valorFormatado;
};
