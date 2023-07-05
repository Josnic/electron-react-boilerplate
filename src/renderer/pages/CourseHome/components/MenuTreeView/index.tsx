import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(3),
    },
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}

const MenuTreeView  = React.forwardRef(({ data, onClickItem }, ref) =>{
  const [dataMenu, setDataMenu] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);

  const setSelectedNodeActive = async(nodeId) => {
    const nodeIdParts = nodeId.split("-");
    setSelectedNode(nodeId);
    let data = {};
    switch(nodeIdParts[0]){
      case "UNIT":
        data = JSON.parse(JSON.stringify(dataMenu[nodeIdParts[1]]));
        delete data.lessons;
      break;
      
      case "LESSON":
        data = JSON.parse(JSON.stringify(dataMenu[nodeIdParts[1]][nodeIdParts[2]]));
      break;

      case "SUBLESSON":
        data = JSON.parse(JSON.stringify(dataMenu[nodeIdParts[1]][nodeIdParts[2]][nodeIdParts[3]]));
      break;
    }
    onClickItem(nodeIdParts[0], data);
  }

  const handleSelect = (event, nodeIds) => {
    console.log(nodeIds)
  }

  React.useImperativeHandle(ref, () => ({
    setSelectedNode: setSelectedNodeActive
  }))
  
  React.useEffect(()=>{
    setDataMenu(data);
  }, [data])

  return (
    <TreeView
      id={"tree-view-menu"}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: 500, overflowY: 'auto' }}
      onNodeSelect={handleSelect}
      selected={selectedNode}
    >
      {dataMenu && dataMenu.length > 0 && dataMenu.map((unit, index) => (
        <StyledTreeItem 
          nodeId={`UNIT-${index}-${unit.cod_unidad}`}
          id={`UNIT-${index}-${unit.cod_unidad}`}
          key={`node-${index}`} 
          labelText={unit.nombre} 
          labelIcon={CheckBoxOutlinedIcon}
          onClick={()=>{
            setSelectedNode(`UNIT-${index}-${unit.cod_unidad}`);
            onClickItem("UNIT", unit);
          }}
        >
          
          {unit.lessons.map((lesson, index2) => (
            <StyledTreeItem
              nodeId={`LESSON-${index}-${index2}`}
              key={`LESSON-${index}-${index2}`}
              labelText={lesson.nombre}
              labelIcon={CheckBoxOutlineBlankOutlinedIcon}
              labelInfo=""
              color="#1a73e8"
              bgColor="#e8f0fe"
              onClick={()=>{
                setSelectedNode(`LESSON-${index}-${index2}`);
                onClickItem("LESSON", lesson)
              }}
            >
              {lesson.sublessons.map((sublesson, index3) => (
                <StyledTreeItem
                  nodeId={`SUBLESSON-${index}-${index2}-${index3}`}
                  key={`SUBLESSON-${index}-${index2}-${index3}`}
                  labelText={sublesson.nombre}
                  labelIcon={CheckBoxOutlinedIcon}
                  labelInfo=""
                  color="#e3742f"
                  bgColor="#fcefe3"
                  onClick={()=>{
                    setSelectedNode(`SUBLESSON-${index}-${index2}-${index3}`);
                    onClickItem("SUBLESSON", sublesson);
                  }}
                />
              ))}
            </StyledTreeItem>
          ))}

        </StyledTreeItem>
      ))}
    </TreeView>
  );
})

export default MenuTreeView;