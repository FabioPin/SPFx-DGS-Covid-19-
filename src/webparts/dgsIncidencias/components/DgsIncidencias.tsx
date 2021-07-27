import * as React from 'react';
import styles from './DgsIncidencias.module.scss';
//props
import { IDgsIncidenciasProps } from './IDgsIncidenciasProps';
import { escape } from '@microsoft/sp-lodash-subset';
//state
import {IDgsIncidenciasState} from './IDgsIncidenciasState';
// services
import {IConcelhosService} from '../../../services/IConcelhosService';
import {ConcelhosService} from '../../../services/ConcelhosService';
//Components
import { DisplayMode } from '@microsoft/sp-core-library';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {MessageBar, MessageBarType} from 'office-ui-fabric-react/lib/MessageBar';
import { Modal, IModalStyleProps, IModalStyles } from 'office-ui-fabric-react/lib/Modal';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react';
//Data Table
import MUIDataTable from "mui-datatables";
//Calendário
import * as moment from 'moment';
import { Container, Row, Col } from "reactstrap";


export class DgsIncidencias extends React.Component<IDgsIncidenciasProps, IDgsIncidenciasState> {

  private concelhosService: IConcelhosService;
  //Props
  constructor(props: IDgsIncidenciasProps) {
    super(props);

    this.concelhosService = new ConcelhosService(props.httpClient);

    //Initial State
    this.state = {
      isLoading: true,
      concelhosInfo: undefined,
      dataError: undefined,
      showModal: false,
      //States para passar para props do Modal Historico de Concelhos / Gráfico
      concelho: undefined,
      dataInicio: undefined,
      dataFinal: undefined
    };
  }

  public componentDidMount() {
    this._loadData();
  }


  public render(): React.ReactElement<IDgsIncidenciasProps> {

    if(this.state.isLoading) {
      return this._renderSpinner();
    }

    if(this.state.dataError) {
      return this._renderError();
    }

    const _columns = ["Concelho", "Incidencia", "Categoria", "Risco", "Casos 14 dias", "População"];

    const options = { 
      filter: true, 
      filterType: "dropdown",
      selectableRows: false,
      //onRowClick: (rowData) => this._onRowClick(rowData), //passar para outro componente
      textLabels: {
        body: {
          noMatch: "Concelho não encontrado",
          toolTip: "Agrupar",
          columnHeaderTooltip: column => `agrupar por ${column.label}`
        },
        pagination: {
          next: "próximo",
          previous: "anterior",
          rowsPerPage: "Linhas por página:",
          displayRows: "de",
        },
        toolbar: {
          search: "Pesquisar",
          downloadCsv: "Extrair CSV",
          print: "Imprimir",
          viewColumns: "Ver colunas",
          filterTable: "Filtrar tabela",
        },
        filter: {
          all: "Todos",
          title: "Filtros",
          reset: "Limpar",
        },
        viewColumns: {
          title: "Mostrar colunas",
          titleAria: "mostrar ou esconder colunas",
        },
        selectedRows: {
          text: "linhas selecionadas",
          delete: "Eliminar",
          deleteAria: "Eliminar linhas selecionadas",
        }
      }
    };

    return (
      <div>
        <h3 className={styles.updateDGS}>Última Atualização DGS {this.state.concelhosInfo[0].data}</h3>
        <MUIDataTable
          title={"Incidencias"}
          data={this.state.concelhosInfo.map(item => {
            return [
              item.concelho,
              item.incidencia,
              item.incidencia_categoria,
              item.incidencia_risco,
              item.casos_14dias,
              item.population
          ];
        })}
        columns={_columns}
        options={options}
      />
      </div>
    );
  }

  private _loadData = async(): Promise<void> => {
    this.setState({
      isLoading: true
    });
    try {
      const concelhosInfo = await this.concelhosService.getConcelhos();
      console.log(concelhosInfo);
      this.setState({
        isLoading: false,
        concelhosInfo
      });
    } catch (error) {
      this.setState({
        concelhosInfo: undefined,
        isLoading: false,
        dataError: (error as Error).message
      });
    }
    //console.log(this.state.concelhosInfo[307].concelho);
  }

  private _renderSpinner = () => {
    return(
      <Spinner
        label={"A carregar informação..."}
        size={SpinnerSize.large}
      ></Spinner>
    );
  }


  private _renderError = (): JSX.Element => {
    return (
      <MessageBar 
        messageBarType={MessageBarType.error}
        isMultiline={false}
      >Erro ao tentar aceder Vacinas EMGFA</MessageBar>
    );
  }
 
}
