import styled from 'styled-components';

/*
É possível fazer renderização condicional de estilos css
sendo assim, o componente receberá em [props] os valores das propriedades
passadas, para tomar a decisão do que fazer em cada estilo separadamente
No caso, se houver a propriedade [error], a cor do texto será vermelha
 */

export const Container = styled.div`
  max-width: 700px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0, 0, 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 80px auto;

  h1 {
    font-size: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1;
    border: 1px solid #fff;
    border-radius: 4px;
    font-size: 16px;
  }
`;

export const SubmitButton = styled.button`
  background: #9159c1;
  border: 0;
  border-radius: 4px;
  margin-left: 10px;
  padding: 5px 15px;

  display: flex;
  align-items: center;
  justify-content: center;
`;
