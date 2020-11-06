import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Search, Label, Message, Icon } from "semantic-ui-react";
import _ from 'lodash';
import history from "../../history";

export default function ModalAddItem({ open, setState, initialState, close, handleEnter,
  handleMessage, data, sear, setSear, source, message, success, handleSubmit }) {

  useEffect(() => {
    if (history.location.state && open && source.length > 0) {
      console.log("PRODUCT FROM HISTORY");
      setTimeout(() => {
        return handleSearchChange(null, { value: history.location.state.data }, true);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSear, open, source]);

  function handleName(e) {

    setState(prevState => ({
      ...prevState,
      name: e
    }));


  };

  function handlePrice(e) {
    //e.preventDefault();
    setState(prevState => ({
      ...prevState,
      price: parseFloat(e).toFixed(2)
    }));
  };

  function handleResultSelect(e, { result }) {
    setSear(prevState => ({
      ...prevState, value: result.title, code: result.code
    }));

    if (result.title === "serviço") {
      setState(prevState => ({
        ...prevState,
        id: parseInt(result.code, 10),
        name: result.title,
        price: parseFloat(result.price),
        precofabrica: parseFloat(result.precofabrica)
      }));
      handleMessage("Tudo Ok", true);
    } else {
      if (result.emestoque > 0) {
        setState(prevState => ({
          ...prevState,
          id: parseInt(result.code, 10),
          name: result.title,
          price: parseFloat(result.price),
          precofabrica: parseFloat(result.precofabrica),
          type: result.type,
        }));

        setTimeout(() => {
          document.getElementById('AddI').click();
          setState(prevState => ({
            ...prevState,
            name: '',
            id: 0,
            price: 0
          }));
          setSear(initialState);
        }, 50);
        handleMessage("Tudo Ok", true);
      } else {
        handleMessage("Produto indisponível", false);
      }

    }
  }

  function handleSearchChange(e, { value }, isHistory = false) {

    setSear(prevState => ({
      ...prevState, isLoading: true, value: value
    }));
    let valueToCompare = sear.value;
    if (isHistory) {
      valueToCompare = value;
    }
    if (valueToCompare) {
      if (valueToCompare.length + 1 < 1) { return setSear(initialState); }
      var re = new RegExp(_.escapeRegExp(valueToCompare), 'i');
      var isMatch = (result) => re.test(result.code);
      var ar = _.filter(source, isMatch);
      if (ar.length === 1) {
        if (ar[0].code === value) {
          
          if (ar[0].emestoque > 0) {
            //bar.className = bar.className.replace("show", "");
            
            setSear(prevState => ({
              ...prevState,
              isLoading: false,
              value: ar[0].title,
              code: ar[0].code
            }));
            setState(prevState => ({
              ...prevState,
              id: parseInt(ar[0].code, 10),
              name: ar[0].title,
              price: parseFloat(ar[0].price),
              precofabrica: parseFloat(ar[0].precofabrica),
              type: ar[0].type,
            }));
            setTimeout(() => {
              document.getElementById('AddI').click();
              setState(prevState => ({
                ...prevState,
                name: '',
                id: 0,
                price: 0
              }));
              setSear(initialState);
            }, 50);
            handleMessage("Tudo Ok", true);
          } else {
            handleMessage("Produto indisponível", false);
            //bar.className = "show";    
          }

        }

      }
      re = new RegExp(_.escapeRegExp(valueToCompare), 'i');
      isMatch = (result) => re.test(result.title);
      console.log(_.filter(source, isMatch));
      setSear(prevState => ({
        ...prevState,
        isLoading: false,
        results: _.filter(source, isMatch)
      }));
    }
  }

  const { isLoading, value, results } = sear;

  return (
    <Modal open={open} onClose={() => close()} closeIcon>
      <Modal.Header >
        Adicionar Item(Produto)
      </Modal.Header>
      <Modal.Content>
        <Form

          //onSubmit={()=>handleSubmit()}
          className="form-horizontal"
        >
          <Form.Field>
            <label className="col-md-2 lead" htmlFor="name">
              Nome
            </label>

            <Input

              name="name"
              type="text"
              required
              value={data.id}
              onChange={e => handleName(e.target.value)}
              onKeyDown={handleEnter}
              disabled
            />
            <Form.Field>
              <Search
                loading={isLoading}
                onResultSelect={handleResultSelect}
                onSearchChange={_.debounce(handleSearchChange, 500, {
                  leading: true,
                })}
                results={results}
                value={value}
                noResultsMessage="Sem resultados..."
                //onKeyDown={handleEnter}
                autoFocus
              //{...this.props}
              />
            </Form.Field>
          </Form.Field>
          <Form.Field>
            <label className="col-md-2 lead" htmlFor="price">
              Preço
              </label>
            <Input labelPosition='right' type='text' placeholder='Valor'>
              <Label >R$</Label>
              <Input type="number"
                step="any"
                min="0"
                defaultValue={data.price}
                onChange={e => handlePrice(e.target.value)}
                className="form-control"
                name="price"
                onKeyDown={handleEnter}
                required
              />

            </Input>



          </Form.Field>


          {message !== "" ? (
            <Message className="message" id="snackbar2" style={{ display: 'block', }} success={success} error={!success} negative>
              <Icon name={success ? "check circle" : "times circle"} />{message}
            </Message>) : (<p >Disponível</p>)}

        </Form>


      </Modal.Content>
      <Modal.Actions>
        <Button className="ui button" id="AddI" onClick={() => handleSubmit()} disabled={value.length === 0} size="massive" positive>Adicionar</Button>
        <Button className="ui button"
          onClick={() => close()}
          size="massive"
        >
          Cancelar
        </Button>
      </Modal.Actions>
    </Modal>
  );
}