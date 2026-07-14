// Importa o componente Stack do Expo Router para navegação em pilha
import { Stack } from "expo-router";

// Componente de Layout de navegação para a sub-pasta (sea)
export default function SeaLayout() {
  return (
    // Configura uma pilha de telas desativando o cabeçalho padrão em todas elas
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Tela de Apresentação/Splash (Atua como a tela principal da pilha) */}
      <Stack.Screen
        name="sea"
        // Define uma transição do tipo fade suave ao entrar nesta tela
        options={{ animation: 'fade' }}
      />

      {/* 2. Tela do Dashboard de Dados do Capitão */}
      <Stack.Screen
        name="home"
        // Desativa qualquer transição visual padrão para que a nossa animação personalizada (portal zoom) seja contínua
        options={{
          animation: 'none',
        }}
      />
    </Stack>
  );
}