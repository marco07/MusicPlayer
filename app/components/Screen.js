
import { View, StatusBar, StyleSheet } from 'react-native'
import color from '../misc/color'
import { useNavigation } from '@react-navigation/native';


const Screen = ({children}) => {
 const navigation = useNavigation();



    return (
      <View style={styles.container}>
        {children}
      </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: color.APP_BG,
        paddingTop: StatusBar.currentHeight
    }
});
export default Screen