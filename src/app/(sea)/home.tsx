// Importa os ícones do Feather da biblioteca expo/vector-icons
import { Feather } from '@expo/vector-icons';
// Importa o componente para renderizar gradientes lineares
import { LinearGradient } from 'expo-linear-gradient';
// Importa componentes estruturais e de rolagem nativos do React Native
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// Importa Reanimated e o layout de entrada animado FadeInDown para efeitos de mola
import Animated, { FadeInDown } from 'react-native-reanimated';
// Importa o hook para obter as margens de área segura do dispositivo
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Componente principal do dashboard pós-transição (Home)
export default function Home() {
  // Obtém as margens seguras para evitar sobreposição com barras do sistema
  const insets = useSafeAreaInsets();

  return (
    // Container principal de tela cheia
    <View style={styles.container}>
      {/* Fundo escuro gradiente de azul petróleo profundo a preto */}
      <LinearGradient
        colors={['#01161e', '#052a36', '#010a0e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Container de rolagem com comportamento de scroll suave */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          // Aplica dinamicamente os paddings de segurança superior e inferior
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloco do Cabeçalho: Saudação e Título de Capitão */}
        <Animated.View
          // Animação de entrada subindo e surgindo suavemente do fundo
          entering={FadeInDown.delay(100).duration(800).springify().damping(15)}
          style={styles.headerRow}
        >
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.title}>Captain</Text>
          </View>

          {/* Widget de Clima/Condição Marítima local */}
          <View style={styles.weatherWidget}>
            <Feather name="cloud-rain" size={20} color="#52b788" />
            <Text style={styles.weatherTemp}>18°C</Text>
            <Text style={styles.weatherDesc}>Heavy Swells</Text>
          </View>
        </Animated.View>

        {/* Card Principal: Condições atuais na Fossa do Pacífico */}
        <Animated.View
          // Animação de entrada com atraso de 250ms e comportamento de mola elástica (springify)
          entering={FadeInDown.delay(250).duration(800).springify().damping(15)}
          style={styles.glassCardWrapper}
        >
          <View style={styles.glassCard}>
            {/* Adiciona o fundo com visual translúcido de vidro */}
            <BlurBackground />
            <Text style={styles.cardLabel}>CURRENT CONDITIONS</Text>
            <Text style={styles.cardValue}>Pacific Abyss</Text>

            {/* Linha de métricas de telemetria submarina */}
            <View style={styles.metricsRow}>
              <View>
                <Text style={styles.metricLabel}>Depth</Text>
                <Text style={styles.metricValue}>4,200m</Text>
              </View>
              <View>
                <Text style={styles.metricLabel}>Temp</Text>
                <Text style={styles.metricValue}>2.4°C</Text>
              </View>
              <View>
                <Text style={styles.metricLabel}>Pressure</Text>
                <Text style={styles.metricValue}>405 atm</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Título da seção de expedições ativas */}
        <Animated.Text
          // Entrada com fade do fundo com atraso de 400ms
          entering={FadeInDown.delay(400).duration(800)}
          style={styles.sectionTitle}
        >
          Active Expeditions
        </Animated.Text>

        {/* Card da Expedição 1: Descida na Fossa das Marianas */}
        <Animated.View
          // Animação de entrada com mola e atraso de 500ms
          entering={FadeInDown.delay(500).duration(800).springify().damping(15)}
          style={styles.glassCardWrapper}
        >
          <View style={styles.glassCardSmall}>
            {/* Efeito de fundo de vidro translúcido */}
            <BlurBackground />
            <View style={styles.cardHeaderRow}>
              <Text style={styles.expeditionTitle}>Mariana Trench Descent</Text>
              {/* Badge indicando o status ativo da expedição */}
              <View style={styles.statusBadgeActive}>
                <Text style={styles.statusText}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.expeditionDesc}>Collecting core sediment samples at Challenger Deep.</Text>
          </View>
        </Animated.View>

        {/* Card da Expedição 2: Levantamento na Zona da Meia-Noite */}
        <Animated.View
          // Animação de entrada com mola e atraso de 650ms
          entering={FadeInDown.delay(650).duration(800).springify().damping(15)}
          style={styles.glassCardWrapper}
        >
          <View style={styles.glassCardSmall}>
            {/* Efeito de fundo de vidro translúcido */}
            <BlurBackground />
            <View style={styles.cardHeaderRow}>
              <Text style={styles.expeditionTitle}>Midnight Zone Survey</Text>
              {/* Badge indicando o status pendente da expedição */}
              <View style={styles.statusBadgePending}>
                <Text style={styles.statusText}>PENDING</Text>
              </View>
            </View>
            <Text style={styles.expeditionDesc}>Bioluminescence pattern mapping in the bathypelagic layer.</Text>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// Componente utilitário que renderiza um fundo gradiente sutil simulando vidro fosco (glassmorphism)
const BlurBackground = () => (
  <View style={[StyleSheet.absoluteFill, styles.glassBase]}>
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
      style={StyleSheet.absoluteFill}
    />
  </View>
);

// Objeto de estilos otimizado (StyleSheet)
const styles = StyleSheet.create({
  // Container geral da tela
  container: {
    flex: 1,
  },
  // Layout interno da área rolável com margens laterais
  scrollContainer: {
    paddingHorizontal: 24,
  },
  // Linha superior de saudação e informações rápidas
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  // Texto secundário de saudação
  greeting: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  // Título em destaque do cabeçalho
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  // Widget flutuante de meteorologia e swells de ondas
  weatherWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minWidth: 90,
  },
  // Texto de temperatura no widget clima
  weatherTemp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  // Descrição do clima sob a temperatura
  weatherDesc: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  // Estilo do título de seção (Active Expeditions)
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 28,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  // Invólucro de borda arredondada e bordas translúcidas de vidro
  glassCardWrapper: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  // Container interno acolchoado do cartão grande de condições
  glassCard: {
    padding: 24,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  // Container interno do cartão de expedição menor
  glassCardSmall: {
    padding: 20,
    minHeight: 100,
  },
  // Cantos arredondados de base para a máscara de vidro
  glassBase: {
    borderRadius: 24,
  },
  // Rótulo pequeno em caixa alta em cima do valor do cartão
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  // Valor principal do título do cartão (Pacific Abyss)
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 16,
  },
  // Fileira de exibição de dados de profundidade, temperatura e pressão
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 16,
  },
  // Rótulo descritivo de cada métrica
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  // Valor numérico de cada métrica com fonte em destaque
  metricValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Alinhamento horizontal para título e badge de status dentro do cartão
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  // Título específico de cada expedição
  expeditionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Texto explicativo e detalhado da expedição
  expeditionDesc: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    lineHeight: 18,
  },
  // Etiqueta verde com bordas suaves para indicar status Ativo
  statusBadgeActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  // Etiqueta amarela com bordas suaves para indicar status Pendente
  statusBadgePending: {
    backgroundColor: 'rgba(241, 196, 15, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(241, 196, 15, 0.3)',
  },
  // Estilo de fonte em caixa alta e negrito para os textos das badges
  statusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});