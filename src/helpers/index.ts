export const formatCurrency = (numeroString: string): string => {
  try {
    const numero = parseFloat(numeroString);

    if (Number.isNaN(numero)) {
      return numeroString;
    }

    const valorFormatado = numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return valorFormatado;
  } catch {
    return numeroString;
  }
};
