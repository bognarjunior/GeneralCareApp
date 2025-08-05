import { StyleSheet } from 'react-native';
import theme from '@/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 48, // se quiser, crie fonts.size.display no theme
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 52,
  },
  titleHighlight: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.family.bold,
  },
  subtitle: {
    fontSize: theme.fonts.size.lg,
    fontFamily: theme.fonts.family.medium,
    color: theme.colors.muted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
  },
  heroImage: {
    marginVertical: theme.spacing.xl,
  },

  // --- Cards area e cards ---
  cardsArea: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FAFF', // ou tema, se preferir
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    // Shadow iOS/Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '11', // leve transparência azul
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  cardTextBox: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: theme.fonts.size.lg,
    fontFamily: theme.fonts.family.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.family.regular,
    color: theme.colors.muted,
  },
  cardArrow: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.muted,
  },
});

export default styles;
