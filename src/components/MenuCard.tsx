import { Card, CardContent, Typography, Button } from '@mui/material';
import './MenuRecipeCard.css'
import { useNavigate } from 'react-router-dom';
import { GETMenuInterface} from '../utils/interfaces';
import { capitalizeFirstLetter } from '../utils/utils';


function MenuCard({menu}: {menu: GETMenuInterface}) {
  const navigate = useNavigate();

  return (
    <Card className='cardContainer'>
      <CardContent className='CardTextContainer'>
        <Typography variant="h5" component="div" style={{ fontWeight: 'bold' }}>
          {capitalizeFirstLetter(menu.title)}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="p">
          {menu.numberDays} días
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {menu.numberServices} personas
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {(menu.avergageEstimatedCost).toFixed(2)} €
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {(menu.caloriesTarget).toFixed(2)} kcal
        </Typography>

        <Button onClick={() => navigate(`/menus/${menu._id}`)} variant="contained" className='buttonCard'>
          Más Info
        </Button>
      </CardContent>
    </Card>
  );
};

export default MenuCard;