import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {ChangeEvent, useEffect} from "react";
import {fetchProducts} from "../../store/actions/productActions";
import {useAppDispatch, useAppSelector} from "../../store";
import {clearProducts, setSearchQuery} from "../../store/reducers/productsSlice";
import {useLocation, useNavigate} from "react-router-dom";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function SearchAppBar() {
  const { searchQuery } = useAppSelector((state) => state.products)
  const {cart: {totalPrice, totalItems}, loading} = useAppSelector((state) => state.cart);
  const isAddToCartInProcess = loading ? Object.values(loading).some(value => value === true) : false;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname === '/checkout';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleSearch = () => {
      dispatch(fetchProducts());
    };

    const debouncedSearch = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSearch, 500);
    };

    debouncedSearch();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if(!searchQuery) {
      dispatch(clearProducts());
    }
  }, [dispatch, searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate('/')}
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          >
            FreshCart Market
          </Typography>
          {!isCheckoutPage && <Search>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
            />
          </Search>}
          <Box display="flex" flexDirection="row" mx={2}>
            <Typography variant="h6" noWrap component="div" mr={2}>
              Total:
            </Typography>
            <Typography variant="h6" noWrap component="div">
              $ {(totalPrice).toFixed(2)}
            </Typography>
          </Box>
          <Badge badgeContent={totalItems} color="secondary"
                 sx={{cursor: 'pointer', pointerEvents: isAddToCartInProcess ? 'none' : ''}}
                 onClick={() => totalItems > 0 && navigate('/checkout')}>
            <ShoppingCartIcon/>
          </Badge>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
