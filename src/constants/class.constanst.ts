import { ClassLevel, Grade } from '@/enums'

export const GRADEMAP: Record<string, string> = {
  [ClassLevel.CLASS_1]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_2]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_3]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_4]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_5]: Grade.PRIMARYSCHOOL,
  [ClassLevel.CLASS_6]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_7]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_8]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_9]: Grade.JUNIORHIGHSCHOOL,
  [ClassLevel.CLASS_10]: Grade.HIGHSCHOOL,
  [ClassLevel.CLASS_11]: Grade.HIGHSCHOOL,
  [ClassLevel.CLASS_12]: Grade.HIGHSCHOOL
}
