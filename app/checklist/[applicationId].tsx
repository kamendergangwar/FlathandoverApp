// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useApp } from '@/contexts/AppContext';
// import { CircleCheck as CheckCircle, Circle, ArrowLeft, ArrowRight, TriangleAlert as AlertTriangle, Zap, Wrench, DoorOpen, Palette, Clock, X } from 'lucide-react-native';

// const categoryIcons = {
//   'Electrical': Zap,
//   'Plumbing': Wrench,
//   'Doors & Windows': DoorOpen,
//   'Walls & Flooring': Palette,
//   'Kitchen & Bathroom': Wrench,
// };

// export default function ChecklistScreen() {
//   const { applicationId } = useLocalSearchParams();
//   const router = useRouter();
//   const { currentFlat, checklist, updateChecklistItem } = useApp();
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
//   const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);

//   if (!currentFlat) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>No flat selected</Text>
//       </SafeAreaView>
//     );
//   }

//   const categories = [...new Set(checklist.map(item => item.category))];
//   const completedItems = checklist.filter(item => item.checked).length;
//   const totalItems = checklist.length;
//   const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
//   const hasIssues = checklist.some(item => !item.checked && item.issue);
//   const incompleteItems = checklist.filter(item => !item.checked);
  
//   // 70% completion requirement
//   const minimumCompletionPercentage = 70;
//   const canProceedWithHandover = progress >= minimumCompletionPercentage;

//   const handleItemToggle = (itemId: string, checked: boolean) => {
//     updateChecklistItem(itemId, checked);
//   };

//   const handleProceed = () => {
//     if (completedItems === totalItems) {
//       router.push(`/signature/${applicationId}`);
//     } else if (hasIssues) {
//       router.push(`/complaint/${applicationId}`);
//     } else if (canProceedWithHandover) {
//       setShowIncompleteDialog(true);
//     } else {
//       Alert.alert(
//         'Insufficient Completion',
//         `At least ${minimumCompletionPercentage}% of the checklist must be completed to proceed with handover. Currently ${Math.round(progress)}% completed.`,
//         [{ text: 'OK' }]
//       );
//     }
//   };

//   const handleProceedWithIncomplete = () => {
//     setShowIncompleteDialog(false);
//     router.push(`/signature/${applicationId}`);
//   };

//   const handleHoldHandover = () => {
//     setShowIncompleteDialog(false);
//     router.push(`/complaint/${applicationId}`);
//   };

//   const renderCategoryItems = (category: string) => {
//     const categoryItems = checklist.filter(item => item.category === category);
//     const completedCategoryItems = categoryItems.filter(item => item.checked).length;
    
//     return (
//       <View key={category} style={styles.categorySection}>
//         <TouchableOpacity 
//           style={styles.categoryHeader}
//           onPress={() => setExpandedCategory(expandedCategory === category ? null : category)}
//         >
//           <View style={styles.categoryTitleContainer}>
//             {categoryIcons[category as keyof typeof categoryIcons] && 
//               React.createElement(categoryIcons[category as keyof typeof categoryIcons], { 
//                 size: 20, 
//                 color: '#2563eb' 
//               })
//             }
//             <Text style={styles.categoryTitle}>{category}</Text>
//           </View>
//           <View style={styles.categoryProgress}>
//             <Text style={styles.categoryProgressText}>
//               {completedCategoryItems}/{categoryItems.length}
//             </Text>
//           </View>
//         </TouchableOpacity>

//         {(expandedCategory === category || expandedCategory === null) && (
//           <View style={styles.categoryItems}>
//             {categoryItems.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={styles.checklistItem}
//                 onPress={() => handleItemToggle(item.id, !item.checked)}
//               >
//                 <View style={styles.itemLeft}>
//                   {item.checked ? (
//                     <CheckCircle size={24} color="#059669" />
//                   ) : (
//                     <Circle size={24} color="#d1d5db" />
//                   )}
//                   <Text style={[
//                     styles.itemText,
//                     item.checked && styles.itemTextCompleted
//                   ]}>
//                     {item.item}
//                   </Text>
//                 </View>
//                 {item.issue && (
//                   <AlertTriangle size={16} color="#f59e0b" />
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderIncompleteDialog = () => {
//     if (!showIncompleteDialog) return null;

//     return (
//       <View style={styles.dialogOverlay}>
//         <View style={styles.dialogContainer}>
//           <View style={styles.dialogHeader}>
//             <AlertTriangle size={32} color="#f59e0b" />
//             <Text style={styles.dialogTitle}>Proceed with Incomplete Checklist?</Text>
//           </View>

//           <Text style={styles.dialogMessage}>
//             {incompleteItems.length} item(s) are not completed ({Math.round(progress)}% complete). You can proceed with the handover acknowledging the incomplete items or hold the handover to address these issues.
//           </Text>

//           <View style={styles.incompleteItemsList}>
//             <Text style={styles.incompleteItemsTitle}>Incomplete Items:</Text>
//             {incompleteItems.slice(0, 3).map((item) => (
//               <View key={item.id} style={styles.incompleteItem}>
//                 <Circle size={16} color="#f59e0b" />
//                 <Text style={styles.incompleteItemText}>{item.item}</Text>
//               </View>
//             ))}
//             {incompleteItems.length > 3 && (
//               <Text style={styles.moreItemsText}>
//                 +{incompleteItems.length - 3} more items
//               </Text>
//             )}
//           </View>

//           <View style={styles.dialogActions}>
//             <TouchableOpacity 
//               style={styles.dialogButtonSecondary}
//               onPress={handleHoldHandover}
//             >
//               <Clock size={16} color="#dc2626" />
//               <Text style={styles.dialogButtonSecondaryText}>Hold Handover</Text>
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.dialogButtonPrimary}
//               onPress={handleProceedWithIncomplete}
//             >
//               <ArrowRight size={16} color="#ffffff" />
//               <Text style={styles.dialogButtonPrimaryText}>Proceed Anyway</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity 
//             style={styles.dialogCloseButton}
//             onPress={() => setShowIncompleteDialog(false)}
//           >
//             <Text style={styles.dialogCloseText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const getProgressColor = () => {
//     if (progress >= minimumCompletionPercentage) return '#059669';
//     if (progress >= 50) return '#f59e0b';
//     return '#dc2626';
//   };

//   const getActionButton = () => {
//     if (completedItems === totalItems) {
//       return (
//         <TouchableOpacity 
//           style={styles.proceedButton}
//           onPress={handleProceed}
//         >
//           <Text style={styles.proceedButtonText}>Proceed to Signature</Text>
//           <ArrowRight size={20} color="#ffffff" />
//         </TouchableOpacity>
//       );
//     } else if (hasIssues) {
//       return (
//         <TouchableOpacity 
//           style={styles.reportButton}
//           onPress={handleProceed}
//         >
//           <AlertTriangle size={20} color="#ffffff" />
//           <Text style={styles.reportButtonText}>Report Issues</Text>
//         </TouchableOpacity>
//       );
//     } else if (canProceedWithHandover) {
//       return (
//         <TouchableOpacity 
//           style={styles.proceedIncompleteButton}
//           onPress={handleProceed}
//         >
//           <Text style={styles.proceedIncompleteButtonText}>
//             Continue with {incompleteItems.length} incomplete item(s)
//           </Text>
//           <ArrowRight size={20} color="#ffffff" />
//         </TouchableOpacity>
//       );
//     } else {
//       return (
//         <View style={styles.blockedContainer}>
//           <X size={24} color="#dc2626" />
//           <View style={styles.blockedTextContainer}>
//             <Text style={styles.blockedTitle}>
//               Minimum {minimumCompletionPercentage}% completion required
//             </Text>
//             <Text style={styles.blockedText}>
//               Complete {Math.ceil((minimumCompletionPercentage / 100) * totalItems) - completedItems} more items to proceed with handover
//             </Text>
//           </View>
//         </View>
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#1e40af', '#2563eb']}
//         style={styles.header}
//       >
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => router.back()}
//         >
//           <ArrowLeft size={24} color="#ffffff" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Handover Checklist</Text>
//           <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
//         </View>
//       </LinearGradient>

//       <View style={styles.progressContainer}>
//         <View style={styles.progressHeader}>
//           <Text style={styles.progressTitle}>Progress</Text>
//           <Text style={styles.progressText}>{completedItems}/{totalItems} completed</Text>
//         </View>
//         <View style={styles.progressBar}>
//           <View style={[
//             styles.progressFill, 
//             { 
//               width: `${progress}%`,
//               backgroundColor: getProgressColor()
//             }
//           ]} />
//         </View>
//         <View style={styles.progressFooter}>
//           <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
//             {Math.round(progress)}%
//           </Text>
//           {progress < minimumCompletionPercentage && (
//             <Text style={styles.minimumRequirement}>
//               Minimum {minimumCompletionPercentage}% required
//             </Text>
//           )}
//         </View>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.instructionsCard}>
//           <Text style={styles.instructionsTitle}>Instructions</Text>
//           <Text style={styles.instructionsText}>
//             Check each item with the applicant. At least {minimumCompletionPercentage}% of items must be completed to proceed with handover. You can report issues for incomplete items or proceed if minimum completion is met.
//           </Text>
//         </View>

//         {categories.map(renderCategoryItems)}

//         <View style={styles.actionContainer}>
//           {getActionButton()}
//         </View>
//       </ScrollView>

//       {renderIncompleteDialog()}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   header: {
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#ffffff',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 2,
//   },
//   progressContainer: {
//     backgroundColor: '#ffffff',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   progressHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   progressTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#111827',
//   },
//   progressText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: '#e5e7eb',
//     borderRadius: 4,
//     marginBottom: 8,
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 4,
//   },
//   progressFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   progressPercentage: {
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//   },
//   minimumRequirement: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#dc2626',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   instructionsCard: {
//     backgroundColor: '#eff6ff',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 20,
//     marginBottom: 24,
//   },
//   instructionsTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#1d4ed8',
//     marginBottom: 8,
//   },
//   instructionsText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#1e40af',
//     lineHeight: 20,
//   },
//   categorySection: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   categoryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   categoryTitleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   categoryTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#111827',
//     marginLeft: 8,
//   },
//   categoryProgress: {
//     backgroundColor: '#f3f4f6',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//   },
//   categoryProgressText: {
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//     color: '#6b7280',
//   },
//   categoryItems: {
//     padding: 16,
//   },
//   checklistItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f9fafb',
//   },
//   itemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#111827',
//     marginLeft: 12,
//     flex: 1,
//   },
//   itemTextCompleted: {
//     color: '#6b7280',
//     textDecorationLine: 'line-through',
//   },
//   actionContainer: {
//     paddingVertical: 24,
//   },
//   proceedButton: {
//     backgroundColor: '#059669',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//   },
//   proceedButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//     marginRight: 8,
//   },
//   reportButton: {
//     backgroundColor: '#f59e0b',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//   },
//   reportButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//     marginLeft: 8,
//   },
//   proceedIncompleteButton: {
//     backgroundColor: '#f59e0b',
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//   },
//   proceedIncompleteButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//     marginRight: 8,
//   },
//   blockedContainer: {
//     backgroundColor: '#fef2f2',
//     borderRadius: 12,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     borderWidth: 1,
//     borderColor: '#fecaca',
//   },
//   blockedTextContainer: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   blockedTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#dc2626',
//     marginBottom: 4,
//   },
//   blockedText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#b91c1c',
//     lineHeight: 20,
//   },
//   dialogOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   dialogContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 24,
//     marginHorizontal: 24,
//     maxWidth: 400,
//     width: '100%',
//   },
//   dialogHeader: {
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   dialogTitle: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//     color: '#111827',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   dialogMessage: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#6b7280',
//     textAlign: 'center',
//     lineHeight: 20,
//     marginBottom: 20,
//   },
//   incompleteItemsList: {
//     backgroundColor: '#fef3c7',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 20,
//   },
//   incompleteItemsTitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#92400e',
//     marginBottom: 8,
//   },
//   incompleteItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   incompleteItemText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#a16207',
//     marginLeft: 8,
//     flex: 1,
//   },
//   moreItemsText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#92400e',
//     textAlign: 'center',
//     marginTop: 4,
//   },
//   dialogActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   dialogButtonSecondary: {
//     backgroundColor: '#fef2f2',
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flex: 1,
//     marginRight: 8,
//   },
//   dialogButtonSecondaryText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#dc2626',
//     marginLeft: 6,
//   },
//   dialogButtonPrimary: {
//     backgroundColor: '#f59e0b',
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flex: 1,
//     marginLeft: 8,
//   },
//   dialogButtonPrimaryText: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//     marginLeft: 6,
//   },
//   dialogCloseButton: {
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   dialogCloseText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#6b7280',
//   },
// });


import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { CircleCheck as CheckCircle, Circle, ArrowLeft, ArrowRight, TriangleAlert as AlertTriangle, Zap, Wrench, DoorOpen, Palette, Clock, X } from 'lucide-react-native';

const categoryIcons = {
  'Electrical': Zap,
  'Plumbing': Wrench,
  'Doors & Windows': DoorOpen,
  'Walls & Flooring': Palette,
  'Kitchen & Bathroom': Wrench,
};

export default function ChecklistScreen() {
  const { applicationId } = useLocalSearchParams();
  const router = useRouter();
  const { currentFlat, checklist, updateChecklistItem, t } = useApp();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);

  if (!currentFlat) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No flat selected</Text>
      </SafeAreaView>
    );
  }

  const categories = [...new Set(checklist.map(item => item.category))];
  const completedItems = checklist.filter(item => item.checked).length;
  const totalItems = checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const hasIssues = checklist.some(item => !item.checked && item.issue);
  const incompleteItems = checklist.filter(item => !item.checked);
  
  // 70% completion requirement
  const minimumCompletionPercentage = 70;
  const canProceedWithHandover = progress >= minimumCompletionPercentage;

  const handleItemToggle = (itemId: string, checked: boolean) => {
    updateChecklistItem(itemId, checked);
  };

  const handleProceed = () => {
    if (completedItems === totalItems) {
      router.push(`/signature/${applicationId}`);
    } else if (hasIssues) {
      router.push(`/complaint/${applicationId}`);
    } else if (canProceedWithHandover) {
      setShowIncompleteDialog(true);
    } else {
      Alert.alert(
        t('insufficient_completion'),
        t('insufficient_completion_message').replace('{percent}', Math.round(progress).toString()),
        [{ text: t('ok') }]
      );
    }
  };

  const handleProceedWithIncomplete = () => {
    setShowIncompleteDialog(false);
    router.push(`/signature/${applicationId}`);
  };

  const handleHoldHandover = () => {
    setShowIncompleteDialog(false);
    router.push(`/complaint/${applicationId}`);
  };

  const renderCategoryItems = (category: string) => {
    const categoryItems = checklist.filter(item => item.category === category);
    const completedCategoryItems = categoryItems.filter(item => item.checked).length;
    
    return (
      <View key={category} style={styles.categorySection}>
        <TouchableOpacity 
          style={styles.categoryHeader}
          onPress={() => setExpandedCategory(expandedCategory === category ? null : category)}
        >
          <View style={styles.categoryTitleContainer}>
            {categoryIcons[category as keyof typeof categoryIcons] && 
              React.createElement(categoryIcons[category as keyof typeof categoryIcons], { 
                size: 20, 
                color: '#2563eb' 
              })
            }
            <Text style={styles.categoryTitle}>{t(category.toLowerCase().replace(/\s+/g, '_').replace('&', ''))}</Text>
          </View>
          <View style={styles.categoryProgress}>
            <Text style={styles.categoryProgressText}>
              {completedCategoryItems}/{categoryItems.length}
            </Text>
          </View>
        </TouchableOpacity>

        {(expandedCategory === category || expandedCategory === null) && (
          <View style={styles.categoryItems}>
            {categoryItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => handleItemToggle(item.id, !item.checked)}
              >
                <View style={styles.itemLeft}>
                  {item.checked ? (
                    <CheckCircle size={24} color="#059669" />
                  ) : (
                    <Circle size={24} color="#d1d5db" />
                  )}
                  <Text style={[
                    styles.itemText,
                    item.checked && styles.itemTextCompleted
                  ]}>
                    {t(item.item)}
                  </Text>
                </View>
                {item.issue && (
                  <AlertTriangle size={16} color="#f59e0b" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderIncompleteDialog = () => {
    if (!showIncompleteDialog) return null;

    return (
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.dialogHeader}>
            <AlertTriangle size={32} color="#f59e0b" />
            <Text style={styles.dialogTitle}>{t('proceed_with_incomplete')}</Text>
          </View>

          <Text style={styles.dialogMessage}>
            {t('incomplete_dialog_message')
              .replace('{count}', incompleteItems.length.toString())
              .replace('{percent}', Math.round(progress).toString())}
          </Text>

          <View style={styles.incompleteItemsList}>
            <Text style={styles.incompleteItemsTitle}>{t('incomplete_items')}</Text>
            {incompleteItems.slice(0, 3).map((item) => (
              <View key={item.id} style={styles.incompleteItem}>
                <Circle size={16} color="#f59e0b" />
                <Text style={styles.incompleteItemText}>{t(item.item)}</Text>
              </View>
            ))}
            {incompleteItems.length > 3 && (
              <Text style={styles.moreItemsText}>
                {t('more_items').replace('{count}', (incompleteItems.length - 3).toString())}
              </Text>
            )}
          </View>

          <View style={styles.dialogActions}>
            <TouchableOpacity 
              style={styles.dialogButtonSecondary}
              onPress={handleHoldHandover}
            >
              <Clock size={16} color="#dc2626" />
              <Text style={styles.dialogButtonSecondaryText}>{t('hold_handover')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dialogButtonPrimary}
              onPress={handleProceedWithIncomplete}
            >
              <ArrowRight size={16} color="#ffffff" />
              <Text style={styles.dialogButtonPrimaryText}>{t('proceed_anyway')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.dialogCloseButton}
            onPress={() => setShowIncompleteDialog(false)}
          >
            <Text style={styles.dialogCloseText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getProgressColor = () => {
    if (progress >= minimumCompletionPercentage) return '#059669';
    if (progress >= 50) return '#f59e0b';
    return '#dc2626';
  };

  const getActionButton = () => {
    if (completedItems === totalItems) {
      return (
        <TouchableOpacity 
          style={styles.proceedButton}
          onPress={handleProceed}
        >
          <Text style={styles.proceedButtonText}>{t('proceed_to_signature')}</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      );
    } else if (hasIssues) {
      return (
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={handleProceed}
        >
          <AlertTriangle size={20} color="#ffffff" />
          <Text style={styles.reportButtonText}>{t('report_issues')}</Text>
        </TouchableOpacity>
      );
    } else if (canProceedWithHandover) {
      return (
        <TouchableOpacity 
          style={styles.proceedIncompleteButton}
          onPress={handleProceed}
        >
          <Text style={styles.proceedIncompleteButtonText}>
            {t('continue_with_incomplete').replace('{count}', incompleteItems.length.toString())}
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.blockedContainer}>
          <X size={24} color="#dc2626" />
          <View style={styles.blockedTextContainer}>
            <Text style={styles.blockedTitle}>
              {t('minimum_completion_required')}
            </Text>
            <Text style={styles.blockedText}>
              {t('complete_more_items').replace('{count}', (Math.ceil((minimumCompletionPercentage / 100) * totalItems) - completedItems).toString())}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e40af', '#2563eb']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('handover_checklist')}</Text>
          <Text style={styles.headerSubtitle}>{currentFlat.flatNo} - {currentFlat.applicantName}</Text>
        </View>
      </LinearGradient>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{t('progress')}</Text>
          <Text style={styles.progressText}>{completedItems}/{totalItems} {t('completed')}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { 
              width: `${progress}%`,
              backgroundColor: getProgressColor()
            }
          ]} />
        </View>
        <View style={styles.progressFooter}>
          <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
            {Math.round(progress)}%
          </Text>
          {progress < minimumCompletionPercentage && (
            <Text style={styles.minimumRequirement}>
              {t('minimum_completion_required')}
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>{t('instructions')}</Text>
          <Text style={styles.instructionsText}>
            {t('instructions_text')}
          </Text>
        </View>

        {categories.map(renderCategoryItems)}

        <View style={styles.actionContainer}>
          {getActionButton()}
        </View>
      </ScrollView>

      {renderIncompleteDialog()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  minimumRequirement: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  instructionsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1d4ed8',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1e40af',
    lineHeight: 20,
  },
  categorySection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  categoryProgress: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  categoryItems: {
    padding: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
  itemTextCompleted: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    paddingVertical: 24,
  },
  proceedButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
  reportButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  reportButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  proceedIncompleteButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  proceedIncompleteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginRight: 8,
  },
  blockedContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  blockedTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  blockedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    marginBottom: 4,
  },
  blockedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#b91c1c',
    lineHeight: 20,
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialogContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    maxWidth: 400,
    width: '100%',
  },
  dialogHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  incompleteItemsList: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  incompleteItemsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400e',
    marginBottom: 8,
  },
  incompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  incompleteItemText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#a16207',
    marginLeft: 8,
    flex: 1,
  },
  moreItemsText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400e',
    textAlign: 'center',
    marginTop: 4,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dialogButtonSecondary: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  dialogButtonSecondaryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
    marginLeft: 6,
  },
  dialogButtonPrimary: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  dialogButtonPrimaryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 6,
  },
  dialogCloseButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dialogCloseText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});